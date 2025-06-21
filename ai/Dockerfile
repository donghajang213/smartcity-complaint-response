FROM python:3.10-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필수 시스템 패키지 설치 (빌드 도구 등)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

# 의존성 먼저 복사 후 설치 -> 캐시 효율화
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# FastAPI 기본 포트
EXPOSE 8001

# 컨테이너 시작 시 Uvicorn으로 FastAPI 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
