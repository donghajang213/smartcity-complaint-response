from langchain_community.document_loaders import CSVLoader
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

class CreateRAG:
    def __init__(self, file_path: str, source_column: str):
        self.file_path = file_path
        self.source_column = source_column

        self.embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

        self.raw_docs = None
        self.db = None

    def csv_loader(self, file_path: str, source_column: str, encoding: str = "utf-8"):
        loader = CSVLoader(
        file_path = file_path,
        encoding = encoding,
        source_column = source_column
        )
        self.raw_docs = loader.load()

    # NaN 처리 및 Document 변환
    def process_documents(self):
        docs = []
        for doc in self.raw_docs:
            try:
                # metadata = doc.metadata
                page_content = doc.page_content.strip()
                page_content = page_content.split("\n질문날짜:")[0]

                # 빈 문서는 제외
                if not page_content:
                    continue
                
                new_metadata = {
                    "질문날짜": doc.page_content.strip().split("\n질문날짜:")[1].split("\n답변날짜:")[0].strip(),
                    "답변날짜": doc.page_content.strip().split("\n답변날짜:")[1].strip()
                }

                # 질문과 답변이 모두 있을 때만 저장
                docs.append(Document(
                    page_content = page_content,
                    metadata = new_metadata
                ))
            except Exception as e:
                print(f"❌ 오류 발생: {e}")
        return docs

    def split_documents(self, docs, chunk_size: int = 600, chunk_overlap: int = 50):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size = chunk_size,
            chunk_overlap = chunk_overlap
        )
        splits = text_splitter.split_documents(docs)
        return splits

    # 벡터 DB 생성 및 저장
    def create_vector_db(self, splits, collection_name: str = "qa_db", persist_directory: str = "db"):
        try:
            db = Chroma(
                embedding_function = self.embedding,
                collection_name = collection_name,
                persist_directory = persist_directory
            )
            db.add_documents(splits)
            db.persist()

            self.db = db
            return self.db
        except:
            return None


    def set_hugging_embedding(self, model_name: str):
        self.embedding = HuggingFaceEmbeddings(model_name = model_name)

    def set_openai_embedding(self, model_name: str):
        from langchain.embeddings import OpenAIEmbeddings
        self.embedding = OpenAIEmbeddings(model_name = model_name)

    def create_rag(self, encoding: str = "utf-8", chunk_size: int = 600, \
                   chunk_overlap: int = 50, collection_name: str = "qa_db",\
                    persist_directory: str = "db"):
        
        self.csv_loader(self.file_path, self.source_column, encoding)
        docs = self.process_documents()
        splits = self.split_documents(docs, chunk_size, chunk_overlap)
        self.create_vector_db(splits, collection_name, persist_directory)

        if self.db:
            print("DB 생성 성공")
            return self.db
        else:
            print("DB 생성에 실패하였습니다.")
            return None

if __name__ == "__main__":
    import os

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(BASE_DIR, "..", "..", "data", "민원데이터.csv")
    c_rag = CreateRAG(file_path, "답변 날짜")
    c_rag.create_rag()