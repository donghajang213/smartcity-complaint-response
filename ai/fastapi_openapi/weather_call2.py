from IntentEntity import ExtractEntities
from weatherAPI import weather
from dotenv import load_dotenv
from dustAPI import get_air_quality  # 미세먼지 API 함수 import
import os

load_dotenv()

def translate_category(df):
    mapping = {
        "LGT": "낙뢰확률",
        "PTY": "강수량",
        "RN1": "1시간 강수량",
        "SKY": "하늘상태",
        "T1H": "기온",
        "REH": "습도",
        "UUU": "풍속(동서성분)",
        "VVV": "풍속(남북성분)",
        "VEC": "풍향",
        "WSD": "풍속",
    }
    df = df.copy()
    df['category_ko'] = df['category'].map(mapping).fillna(df['category'])
    return df

def translate_fcstValue(df):
    df = df.copy()

    # 하늘상태 (SKY)
    sky_mapping = {
        "1": "맑음",
        "3": "구름많음",
        "4": "흐림"
    }

    # 강수형태 (PTY)
    pty_mapping = {
        "0": "없음",
        "1": "비",
        "2": "비/눈",
        "3": "눈",
        "4": "소나기",
        "5": "빗방울",
        "6": "빗방울눈날림",
        "7": "눈날림"
    }

    # 낙뢰확률 (LGT)
    lgt_mapping = {
        "0": "없음",
        "1": "있음"
    }

    # 풍향 (VEC)은 숫자 각도로 그냥 둠
    # 풍속(동서성분 UUU), 풍속(남북성분 VVV), 풍속(WSD), 습도(REH), 기온(T1H), 강수량(RN1)은 숫자 그대로 둠

    df.loc[df['category'] == 'SKY', 'fcstValue'] = df.loc[df['category'] == 'SKY', 'fcstValue'].astype(str).map(sky_mapping).fillna(df['fcstValue'])
    df.loc[df['category'] == 'PTY', 'fcstValue'] = df.loc[df['category'] == 'PTY', 'fcstValue'].astype(str).map(pty_mapping).fillna(df['fcstValue'])
    df.loc[df['category'] == 'LGT', 'fcstValue'] = df.loc[df['category'] == 'LGT', 'fcstValue'].astype(str).map(lgt_mapping).fillna(df['fcstValue'])

    return df

entity_to_category_map = {
    "기온": ["T1H"],
    "강수형태": ["PTY"],
    "강수량": ["RN1"],
    "풍량": ["UUU", "VVV", "WSD"],
    "풍속": ["WSD"],
    "하늘상태": ["SKY"],
    "습도": ["REH"],
    "낙뢰": ["LGT"],
}
# 미세먼지용 entity to 컬럼 매핑
dust_entity_map = {
    "미세먼지": "pm10Value",
    "초미세먼지": "pm25Value"
}

def call_weather_api_from_entities(entities_result: dict):
    # 공통 지역 추출
    all_entities = [e for e in entities_result["entities"]]
    common_region = next((e["value"] for e in all_entities if e.get("type") == "지역"), None)

    # 날씨 관련 요청들 모으기
    weather_requests = []
    dust_requests = []
    print(entities_result)
    intent = entities_result["intent"]
    entities = entities_result["entities"]
    region = next((e["value"] for e in entities if e.get("type") == "지역"), common_region)
    if not region:
        print(f"❌ '{intent}' 관련 API 호출에 필요한 지역 정보가 없어 조회할 수 없습니다.")
        return 0
    
    requested_types = list({e.get("type") for e in entities if e.get("type") != "지역" and e.get("type")})
    
    if intent == "날씨":
        weather_requests.append((region, requested_types))
    elif intent == "미세먼지":
        dust_requests.append((region, requested_types))
    else:
        print(f"⚠️ '{intent}'에 대한 API 연결은 아직 구현되지 않았습니다.")

    # 날씨 데이터 호출 및 출력 (중복 지역은 하나로 합칠 수도 있음)
    for region, requested_types in weather_requests:
        print(f"\n✅ '{region}' 지역 날씨 데이터를 가져옵니다...\n")
        df_weather = weather(region)
        if df_weather is None or df_weather.empty:
            print("⚠️ 날씨 API로부터 데이터를 받지 못했습니다.")
            continue
        
        df_weather = translate_category(df_weather)
        df_weather = translate_fcstValue(df_weather)

        if requested_types:
            categories_to_filter = []
            for t in requested_types:
                categories_to_filter.extend(entity_to_category_map.get(t, []))
            categories_to_filter = list(set(categories_to_filter))

            filtered_df = df_weather[df_weather['category'].isin(categories_to_filter)]
            if not filtered_df.empty:
                print(f"🎯 요청 항목: {', '.join(requested_types)}")
                print(filtered_df[['category_ko', 'fcstTime', 'fcstValue']])
            else:
                print("⚠️ 요청한 항목에 해당하는 데이터가 없습니다.")
        else:
            print("🔍 전체 날씨 항목:")
            print(df_weather[['category_ko', 'fcstTime', 'fcstValue']])

    # 미세먼지 데이터 호출 및 출력
    for region, requested_types in dust_requests:
        sido_name = "서울"  # 필요시 변경
        print(f"\n✅ '{region}' 지역 미세먼지 데이터를 가져옵니다...\n")
        df_dust = get_air_quality(sido_name=sido_name, region=region)

        if df_dust is None or df_dust.empty:
            print("⚠️ 미세먼지 API로부터 데이터를 받지 못했습니다.")
            continue

        if requested_types:
            for rt in requested_types:
                column = dust_entity_map.get(rt)
                if column and column in df_dust.columns:
                    for _, row in df_dust.iterrows():
                        print(f"{row['stationName']} 기준 {rt} 수치: {row[column]} ㎍/㎥ (측정시각: {row['dataTime']})")
                else:
                    print(f"⚠️ 요청한 항목 '{rt}'에 대한 데이터가 없습니다.")
        else:
            print(df_dust[['stationName', 'pm10Value', 'pm25Value', 'dataTime']])



if __name__=="__main__":
    extract_entities = ExtractEntities(api_key=os.getenv("GOOGLE_API_KEY"))

    question = "오늘 합정 12시 온도랑 미세먼지 알려줘"


    categories = extract_entities.extract_category(question)
    print(categories)
    intents = extract_entities.extract_intents(question, categories)
    print(f"🔍 intents: {intents}")
    question_result = extract_entities.extract_entities(question, categories, intents)

    print(f"🔍 추출된 엔티티: {question_result}")

    call_weather_api_from_entities(question_result)
