from langchain_community.document_loaders import CSVLoader
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
import os

class CreateRAG:
    def __init__(self, file_path: str, source_column: str):
        self.file_path = file_path
        self.source_column = source_column

        # 기본 임베딩 설정
        self.embedding = HuggingFaceEmbeddings(
            model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        )
        self.raw_docs = None
        self.db = None

    def csv_loader(self, file_path: str, source_column: str, encoding: str = "utf-8"):
        loader = CSVLoader(
            file_path=file_path,
            encoding=encoding,
            source_column=source_column
        )
        self.raw_docs = loader.load()

    def process_documents(self):
        docs = []
        for doc in self.raw_docs:
            try:
                page_content = doc.page_content.strip()
                page_content = page_content.split("\n질문날짜:")[0]
                if not page_content:
                    continue
                new_metadata = {
                    "질문날짜": doc.page_content.strip().split("\n질문날짜:")[1]
                                .split("\n답변날짜:")[0].strip(),
                    "답변날짜": doc.page_content.strip().split("\n답변날짜:")[1].strip()
                }
                docs.append(Document(page_content=page_content, metadata=new_metadata))
            except Exception as e:
                print(f"❌ 오류 발생: {e}")
        return docs

    def split_documents(self, docs, chunk_size: int = 600, chunk_overlap: int = 50):
        splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        return splitter.split_documents(docs)

    def create_vector_db(self, splits, collection_name: str = "qa_db", persist_directory: str = "db"):
        # **로컬(in-process) 모드**: 컨테이너 내부의 파일 시스템에 저장
        db = Chroma(
            embedding_function=self.embedding,
            collection_name=collection_name,
            persist_directory=persist_directory
        )
        db.add_documents(splits)
        db.persist()
        self.db = db
        return db

    def create_rag(
        self,
        encoding: str = "utf-8",
        chunk_size: int = 600,
        chunk_overlap: int = 50,
        collection_name: str = "qa_db",
        persist_directory: str = "db"
    ):
        print("▶▶ CreateRAG 스크립트 진입 (로컬 모드)")
        print("🔄 RAG 생성 시작... (로컬 모드)")
        print("🗂 CSV 로딩 중...")
        self.csv_loader(self.file_path, self.source_column, encoding)
        print(f"📑 문서 개수: {len(self.raw_docs)}")
        docs = self.process_documents()
        print(f"✂️ 분할된 청크 개수: {len(docs)}")
        splits = self.split_documents(docs, chunk_size, chunk_overlap)
        print("💾 벡터 DB 생성 중...")
        self.create_vector_db(splits, collection_name, persist_directory)

        if self.db:
            print("✅ DB 생성 성공 (로컬 모드)")
            print("▶▶ CreateRAG 스크립트 종료 (로컬 모드)")
            return self.db
        else:
            print("❌ DB 생성에 실패하였습니다. (로컬 모드)")
            print("▶▶ CreateRAG 스크립트 종료 (로컬 모드)")
            return None

if __name__ == "__main__":
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(BASE_DIR, "..", "..", "data", "민원데이터.csv")
    c_rag = CreateRAG(file_path, "답변날짜")
    c_rag.create_rag()
