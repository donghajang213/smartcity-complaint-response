# OneCityQ
- AI 응용 서비스 플랫폼 구축/운용 실무 교육 - (주)한국스마트빌리지협회
- 3팀 OneCityQ (챗봇 하나로 묻고 답하는 스마트시티)
## 팀원 구성
| 장동하 | 정구일 | 조선아 |
|:---:|:---:|:---:|
|<a href='https://github.com/donghajang213'> <img src='https://avatars.githubusercontent.com/u/117894209?v=4' width='300'> <br> @donghajang213 </a> | <a href='https://github.com/guil221'> <img src='https://github.com/suusuu00/SESAC-team2/assets/124228791/a7bc9554-fa4a-4705-a3a6-d1c05d897cc4' width='300'> <br> @guil221 </a> | <a href='https://github.com/suusuu00'> <img src='https://github.com/suusuu00/SESAC-team2/assets/124228791/43413408-df69-4377-b599-a0396aad71d1' width='300'> <br> @suusuu00 </a> |

# 스마트시티 민원 챗봇
<p align='center'>
  <h2>메인 화면</h2>
  <img src='https://github.com/user-attachments/assets/741ed769-99c7-46d3-bd06-ddffcdc4879a' width='800'>
  <h2>챗봇 화면</h2>
  <img src='https://github.com/user-attachments/assets/5beee9ca-81e8-4965-a296-c3b2b8fd85e5' width='800'>
</p>

## 프로젝트 소개
- 스마트시티 관련 정보를 중심으로, 서울 시민의 자주 묻는 민원 질문에 RAG 기반으로 답변하는 LLM 챗봇 서비스

## 개발 환경
- **Crawling** : Selenium
- **Frontend** : React
- **Backend** : Spring Boot
- **DB** : PostgreSQL
- **LLM** : GPT (`gpt-4o-mini`), Gemini (`gemini-2.0-flash`), Langchain
    - Embedding 모델 : `BAAI/bge-base-en-v1.5`
- **Server** : AWS
- **협업 툴**
    - Github : 브랜치를 이용하여 만든 코드 업로드, Merge 등
    - Notion : 프로젝트 목표 및 일정 정리를 통해 해야 할 일 확인

## 역할 분담
### ⭐️ 장동하
- **백엔드**
  - 로그인, 회원가입 기능 구현
  - 관리자 대시보드 구현
- **서버**
  - git action을 통해 AWS 서버 연동

### ⚾️ 정구일
- **프론트엔드**
  - 메인화면, 챗봇 화면 구현
- **백엔드**
  - 로그인 기능 구현

### 🍑 조선아
- **크롤링**
  - 국민신문고 민원 데이터 크롤링
- **프론트엔드**
  - 채팅 기록 통계 대시보드 구현
- **백엔드**
  - 채팅 기록 통계 대시보드 구현
  - GPT를 통한 민원 답변, 질문, 사용자 ID 등을 DB에 저장
- **LLM**
  - 사용자 의도 파악 (Gemini 기반 Intent-Entity 분석) 기능 개발
  - GPT를 활용한 일상 대화 기능 개발
  - GPT + Open API 기반 실시간 정보 응답 기능 개발
  - GPT를 활용한 RAG기반 민원 응답 기능 개발
