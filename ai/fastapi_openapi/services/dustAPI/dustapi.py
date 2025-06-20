import requests
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_air_quality(sido_name='서울', region=None):
    # 동 → 구 변환을 위한 엑셀 불러오기
    file_path = '기상청.xlsx'
    df_loc = pd.read_excel(os.path.join(BASE_DIR, "../../data", file_path), sheet_name='최종 업데이트 파일_20241031')

    gu_name = region  # 일단 기본값은 입력값

    # 동 이름일 경우 구 이름으로 변환
    matched = df_loc[(df_loc['1단계'].str.contains(sido_name)) & (df_loc['3단계'].str.contains(region or "", na=False))]
    if not matched.empty:
        gu_name = matched.iloc[0]['2단계']
        print(f"🔁 입력된 '{region}'은(는) '{gu_name}' 구에 속함.")

    # 미세먼지 API 호출
    service_key = "vlFqNOMGHQuVJ6GoaP8C99d89CrkizjL/eMTJtgiLYQVr9Sbmo0CKfDHKR/6WhBptBwMDguCzQQxFMZHhKxSCw=="
    endpoint = "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty"
    params = {
        'serviceKey': service_key,
        'returnType': 'json',
        'numOfRows': 100,
        'pageNo': 1,
        'sidoName': sido_name,
        'ver': '1.0'
    }

    response = requests.get(endpoint, params=params)

    if response.status_code == 200:
        data = response.json()
        items = data['response']['body']['items']
        df = pd.DataFrame(items)

        if gu_name:
            df_gu = df[df['stationName'] == gu_name]
            df_gu_all = df[df['stationName'].str.contains(gu_name.replace(" ", ""), na=False)]

            if not df_gu.empty:
                return df_gu
            elif not df_gu_all.empty:
                return df_gu_all
            else:
                print(f"⚠️ '{gu_name}'에 해당하는 측정소를 찾을 수 없습니다.")
                return None
        else:
            return df
    else:
        print(f"❌ 요청 실패: {response.status_code}")
        return None

# ✅ 예시
if __name__ == "__main__":
    # 예: '합정' → '마포구' 자동 매핑 → 마포구 미세먼지 데이터 조회
    df_air = get_air_quality("서울", "합정")
    if df_air is not None:
        print(df_air[['stationName', 'pm10Value', 'pm25Value', 'dataTime']])