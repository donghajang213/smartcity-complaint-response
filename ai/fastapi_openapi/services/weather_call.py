from .IntentEntity import ExtractEntities
from .weatherAPI import weather
from .dustAPI import get_air_quality
from dotenv import load_dotenv
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

    sky_mapping = {"1": "맑음", "3": "구름많음", "4": "흐림"}
    pty_mapping = {
        "0": "없음", "1": "비", "2": "비/눈", "3": "눈", "4": "소나기",
        "5": "빗방울", "6": "빗방울눈날림", "7": "눈날림"
    }
    lgt_mapping = {"0": "없음", "1": "있음"}

    df.loc[df['category'] == 'SKY', 'fcstValue'] = df.loc[df['category'] == 'SKY', 'fcstValue'].astype(str).map(sky_mapping).fillna(df['fcstValue'])
    df.loc[df['category'] == 'PTY', 'fcstValue'] = df.loc[df['category'] == 'PTY', 'fcstValue'].astype(str).map(pty_mapping).fillna(df['fcstValue'])
    df.loc[df['category'] == 'LGT', 'fcstValue'] = df.loc[df['category'] == 'LGT', 'fcstValue'].astype(str).map(lgt_mapping).fillna(df['fcstValue'])

    return df

def format_fcst_time(time_str):
    if isinstance(time_str, (int, float)):
        time_str = str(int(time_str))
    if time_str.endswith("00"):
        return time_str[:-2] + "시"
    else:
        return time_str + "시"

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

dust_entity_map = {
    "미세먼지": "pm10Value",
    "초미세먼지": "pm25Value"
}

def call_weather_api_from_entities(entities_result: dict):
    results_dict = {
        "entity_results": entities_result,
        "API_results": []
    }

    entities = entities_result.get("entities", [])
    region = next((e["value"] for e in entities if e.get("type") == "지역"), None)
    if not region:
        return results_dict

    # 요청된 타입들 (기온, 미세먼지 등)
    requested_types = list({e.get("type") for e in entities if e.get("type") != "지역"})

    # requested_types가 비어있으면 기본 날씨 타입들로 설정 (기본 정보)
    if not requested_types:
        requested_types = ["기온", "강수형태", "강수량"]

    # 날씨 관련 타입 모으기
    weather_types = [t for t in requested_types if t in entity_to_category_map.keys()]
    # 미세먼지 관련 타입 모으기
    dust_types = [t for t in requested_types if t in dust_entity_map.keys()]

    # 날씨 API 호출
    if weather_types:
        df_weather = weather(region)
        if df_weather is not None and not df_weather.empty:
            df_weather = translate_category(df_weather)
            df_weather = translate_fcstValue(df_weather)

            categories_to_filter = []
            for t in weather_types:
                categories_to_filter.extend(entity_to_category_map.get(t, []))
            categories_to_filter = list(set(categories_to_filter))
            filtered_df = df_weather[df_weather['category'].isin(categories_to_filter)]
            filtered_df['fcstTime'] = filtered_df['fcstTime'].apply(format_fcst_time)

            if not filtered_df.empty:
                results_dict["API_results"].append({
                    "type": "날씨",
                    "data": filtered_df[['category_ko', 'fcstTime', 'fcstValue']].to_dict(orient="records")
                })

    # 미세먼지 API 호출
    if dust_types:
        sido_name = "서울"  # 필요시 조정
        df_dust = get_air_quality(sido_name=sido_name, region=region)
        if df_dust is not None and not df_dust.empty:
            dust_results = []
            for dt in dust_types:
                column = dust_entity_map.get(dt)
                if column and column in df_dust.columns:
                    for _, row in df_dust.iterrows():
                        dust_results.append({
                            "local": row['stationName'],
                            "dust_type": dt,
                            "dust_value": row[column],
                            "dataTime": row['dataTime']
                        })
            if dust_results:
                results_dict["API_results"].append({
                    "type": "미세먼지",
                    "data": dust_results
                })

    return results_dict