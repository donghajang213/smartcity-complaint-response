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
                result = data["results"]

                if result["answer"] and result["sources"]:
                    if type(result["sources"]) != list:
                        st.success(result["answer"] + "\n\n\n\n" + str(result["sources"]["metadata"]))
                    else:
                        st.success(result["answer"])
                        for source in result["sources"]:
                            print(type(source))
                            if "API_results" in source.keys():
                                api_results = source["API_results"]
                                if type(api_results) == str:
                                    api_results = api_results.replace("\n", "\n\n")
                                st.success(source["API_results"])
                elif result["answer"]:
                    st.success(result["answer"])

                # api_results = []
                # for result in data["results"]:
                #     if result["entity_results"]["intent"] == "미세먼지":
                #         api_result = result["API_results"]
                #         if api_result:
                #             local = api_result["local"]
                #             dust_type = api_result["dust_type"]
                #             dust_value = api_result["dust_value"]
                #             dataTime = api_result["dataTime"]
                #             st.success(f"✅ 미세먼지 API 호출 성공\n\n지역 : {local}\n\n먼지 유형:{dust_type}\n\n농도: {dust_value} ㎍/㎥\n\n측정 시간: {dataTime}")
                #         else:
                #             st.error(f"❌ 미세먼지 API 호출 실패: {res.status_code}")
                #     elif result["entity_results"]["intent"] == "날씨":
                #         api_result = result["API_results"]
                #         if api_result:
                #             # st.success(api_result)
                #             df = pd.DataFrame(api_result)
                #             st.success(f"✅ 날씨 API 호출 성공\n\n")
                #             st.title("📊 날씨 예보 결과")
                #             st.dataframe(df, use_container_width=True)
                #     else:
                #         for api_result in result["API_results"]:
                #             if type(api_result) == list:
                #                 api_result = '\n\n'.join(api_result).replace('\n', '\n\n')
                #                 api_results.append(api_result)
                #             else:
                #                 api_results.append(api_result)
                #         api_results = '\n\n\n\n'.join(str(x) for x in api_results)
                #         print(api_results)
                #         api_results = api_results.replace('\n', '\n\n')
                #         st.success(f"💬\n\n{api_results}")
            else:
                st.error(f"❌ 서버 오류: {res.status_code}")

        except Exception as e:
            st.error(f"더 자세하게 질문을 입력해주세요.\n\n오류: {e}")
