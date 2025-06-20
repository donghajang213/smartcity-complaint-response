import streamlit as st
import requests
import pandas as pd

st.title("🚇 지하철 도착 정보 챗봇")

st.markdown("서울역, 강남역 등의 도착 시간을 물어보세요!")

# 사용자 입력 받기
user_input = st.text_input("질문을 입력하세요", placeholder="예: 서울역 도착 시간 알려줘")

# FastAPI 백엔드 URL (로컬에서 8000 포트 기준)
BACKEND_URL = "http://localhost:8000/chat"

if st.button("질문하기") and user_input:
    with st.spinner("⏳ 응답을 기다리는 중..."):
        try:
            res = requests.post(
                BACKEND_URL,
                json = {"message": user_input}
            )

            if res.status_code == 200:
                data = res.json()
                results = data["answer"]["results"]
                print("\n\n\n", results)
                if results["answer"] and results["sources"]:
                    for source in results["sources"]:
                        if "API_results" in source.keys():
                            st.success(results["answer"] + "\n\n\n\n" + str(source["API_results"]))
                        elif "metadata" in source.keys():
                            st.success(results["answer"] + "\n\n\n\n관련 질문 날짜 기록:\n" + str(source["metadata"]))
                elif results["answer"]:
                    st.success(results["answer"])

            else:
                st.error(f"❌ 서버 오류: {res.status_code}")

        except Exception as e:
            st.error(f"더 자세하게 질문을 입력해주세요.\n\n오류: {e}")
