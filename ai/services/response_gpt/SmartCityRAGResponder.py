from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA

from sklearn.metrics.pairwise import cosine_similarity
import textwrap

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "db")

class SmartCityRAGResponder:
    def __init__(self, llm, db_path=db_path, collection_name="qa_db"):
        self.embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
        self.llm = llm
        self.db = Chroma(
            embedding_function=self.embedding,
            collection_name=collection_name,
            persist_directory=db_path
        )
        self.qa_chain = self._create_qa_chain()

    def _create_qa_chain(self, k=10):
        prompt = PromptTemplate.from_template(
            textwrap.dedent(
                """
                당신은 민원 응대 담당 AI입니다. 아래 문서들을 바탕으로 사용자의 질문에 성실히 답변하세요.
                문서:
                {context}

                질문: {question}
                답변:
                """
            )
        )
        return RetrievalQA.from_chain_type(
            llm=self.llm,
            retriever=self.db.as_retriever(search_kwargs={"k": k}),
            return_source_documents=True,
            chain_type_kwargs={"prompt": prompt}
        )

    def answer(self, question, sim_threshold=0.45):
        result = self.qa_chain(question)
        answer = result["result"]
        source_docs = result["source_documents"]

        if not source_docs:
            return {"message": "관련 문서를 찾지 못했습니다."}

        query_vec = self.embedding.embed_query(question)
        top_doc = source_docs[0]
        top_doc_text = source_docs[0].page_content if source_docs else ""
        top_doc_vec = self.embedding.embed_query(top_doc_text) if top_doc_text else [0]
        sim = cosine_similarity([query_vec], [top_doc_vec])[0][0] if top_doc_text else 0

        if sim < sim_threshold:
            return {
                "answer": "죄송합니다. 해당 내용에 대해서는 잘 알지 못합니다.",
                "sources": None
            }
        else:
            return {
                "answer": answer,
                "sources": {
                    "content": top_doc.page_content,
                    "metadata": top_doc.metadata
                }
            }
