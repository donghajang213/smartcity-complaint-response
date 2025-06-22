import pandas as pd
import os
from datetime import datetime, timedelta
import requests
from dotenv import load_dotenv

load_dotenv()
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_region_coordinates(region_name):
    """
    지역 이름(2단계 또는 3단계)을 기반으로 격자 좌표(X, Y)를 반환합니다.
    """
    file_path = 'meteorological_administration.xlsx'
    df = pd.read_excel(os.path.join(BASE_DIR, "..", "..", "data", file_path), sheet_name = '20241031')

    # 3단계(동) 기준으로 먼저 찾기
    matched_dong = df[(df['1단계'] == '서울특별시') & (df['3단계'].str.contains(region_name, na=False))]
    if not matched_dong.empty:
        row = matched_dong.iloc[0]
        print(f"🔁 입력된 '{region_name}'은 '{row['2단계']}' 구에 속함.")
        return row['2단계'], int(row['격자 X']), int(row['격자 Y'])

    # 2단계(구) 기준으로 찾기
    matched_gu = df[(df['1단계'] == '서울특별시') & (df['2단계'].str.contains(region_name, na=False))]
    if not matched_gu.empty:
        row = matched_gu.iloc[0]
        return row['2단계'], int(row['격자 X']), int(row['격자 Y'])

    # 지역 못 찾음
    return None, None, None


def weather(region):
    print(f"입력된 지역: {region}")

    # 지역명으로 격자 좌표 가져오기
    gu_name, nx, ny = get_region_coordinates(region)

    if not gu_name:
        raise ValueError(f"❌ '{region}'과(와) 일치하는 지역을 찾을 수 없습니다.")

    # 기준 날짜 및 시간 계산
    now = datetime.now()
    base_time = now.replace(minute=0, second=0, microsecond=0)
    if now.minute < 45:
        base_time -= timedelta(hours=1)
    base_date = base_time.strftime("%Y%m%d")
    base_time = base_time.strftime("%H%M")

    # 초단기예보 API 호출
    url = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst"
    if not WEATHER_API_KEY:
        raise ValueError("❌ WEATHER_API_KEY가 설정되어 있지 않습니다. .env 파일을 확인하세요.")
    params = {
        'serviceKey': WEATHER_API_KEY,  # 발급받은 인증키 사용
        'pageNo': '1',
        'numOfRows': '1000',
        'dataType': 'JSON',
        'base_date': base_date,
        'base_time': base_time,
        'nx': nx,
        'ny': ny
    }

    response = requests.get(url, params=params)
    data = response.json()

    if 'response' in data and data['response']['header']['resultCode'] == '00':
        items = data['response']['body']['items']['item']
        df_result = pd.DataFrame(items)
        print(f"✅ '{gu_name}' 지역의 날씨 데이터를 가져왔습니다.")
        return df_result
    else:
        print("❌ API 호출 실패:", data)
        return None
