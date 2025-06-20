from .weatherAPI import weather
from .dustAPI import get_air_quality

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
    sky_mapping = {"1": "맑음", "3": "구름많음", "4": "흐림"}

    # 강수형태 (PTY)
    pty_mapping = {
        "0": "없음", "1": "비", "2": "비/눈", "3": "눈", "4": "소나기",
        "5": "빗방울", "6": "빗방울눈날림", "7": "눈날림"
    }

    # 낙뢰확률 (LGT)
    lgt_mapping = {"0": "없음", "1": "있음"}

    # 풍향 (VEC)은 숫자 각도로 그냥 둠
    # 풍속(동서성분 UUU), 풍속(남북성분 VVV), 풍속(WSD), 습도(REH), 기온(T1H), 강수량(RN1)은 숫자 그대로 둠

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
# 미세먼지용 entity to 컬럼 매핑
dust_entity_map = {
    "미세먼지": "pm10Value",
    "초미세먼지": "pm25Value"
}

def call_weather_api_from_entities(entities_result: dict):
    api_results = []

    # ✅ 역 → 구 매핑
    station_to_district_map = {
    "서울역": "중구",
    "용산역": "용산구",
    "이태원역": "용산구",
    "한남역": "용산구",
    "강남역": "강남구",
    "역삼역": "강남구",
    "선릉역": "강남구",
    "삼성역": "강남구",
    "신사역": "강남구",
    "청담역": "강남구",
    "건대입구역": "광진구",
    "구의역": "광진구",
    "천호역": "강동구",
    "둔촌동역": "강동구",
    "길동역": "강동구",
    "잠실역": "송파구",
    "잠실새내역": "송파구",
    "송파역": "송파구",
    "가락시장역": "송파구",
    "고속터미널역": "서초구",
    "교대역": "서초구",
    "서초역": "서초구",
    "방배역": "서초구",
    "사당역": "동작구",
    "상도역": "동작구",
    "노량진역": "동작구",
    "영등포역": "영등포구",
    "신길역": "영등포구",
    "여의도역": "영등포구",
    "마포역": "마포구",
    "공덕역": "마포구",
    "홍대입구역": "마포구",
    "합정역": "마포구",
    "신촌역": "서대문구",
    "이대역": "서대문구",
    "충정로역": "서대문구",
    "종로3가역": "종로구",
    "종각역": "종로구",
    "광화문역": "종로구",
    "안국역": "종로구",
    "동대문역": "종로구",
    "혜화역": "종로구",
    "을지로입구역": "중구",
    "을지로3가역": "중구",
    "충무로역": "중구",
    "동대문역사문화공원역": "중구",
    "왕십리역": "성동구",
    "뚝섬역": "성동구",
    "성수역": "성동구",
    "상왕십리역": "성동구",
    "노원역": "노원구",
    "상계역": "노원구"
}
    entities = entities_result.get("entities", [])
    region = next((e["value"] for e in entities if e.get("type") == "지역"), None)

    # ✅ 역 이름이면 행정구 이름으로 치환
    region = station_to_district_map.get(region, region)

    if not region:
        return api_results

    # 요청된 타입들 (기온, 미세먼지 등)
    requested_types = list({e.get("type") for e in entities if e.get("type") != "지역"})

    # requested_types가 비어있으면 기본 날씨 타입들로 설정
    if not requested_types:
        requested_types = ["기온", "강수형태", "강수량"]

    # 날씨 관련 타입
    weather_types = [t for t in requested_types if t in entity_to_category_map.keys()]
    # 미세먼지 관련 타입
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
                api_results.append({
                    "type": "날씨",
                    "data": filtered_df[['category_ko', 'fcstTime', 'fcstValue']].to_dict(orient="records")
                })

    # 미세먼지 API 호출
    if dust_types:
        sido_name = "서울"
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
                api_results.append({
                    "type": "미세먼지",
                    "data": dust_results
                })

    return api_results
