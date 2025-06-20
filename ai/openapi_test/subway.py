import requests
import pandas as pd
import time
import json
import os

# ✅ 1. 엑셀에서 지하철 역 이름 불러오기
excel_path = "subway.xlsx"  # 같은 폴더에 둘 것
try:
    df = pd.read_excel(excel_path)
except Exception as e:
    print(f"❌ 엑셀 파일 읽기 실패: {e}")
    exit()

station_names = df["STATN_NM"].dropna().unique().tolist()

# ✅ 2. 서울열린데이터 API 호출 함수
def get_all_arrivals(statn_nm, apikey, batch_size=100):
    all_data = []
    start = 0
    while True:
        end = start + batch_size - 1
        url = f"http://swopenapi.seoul.go.kr/api/subway/{apikey}/json/realtimeStationArrival/{start}/{end}/{statn_nm}"
        try:
            response = requests.get(url, timeout=10)
            if response.status_code != 200:
                print(f"❌ API 호출 실패: {response.status_code} - 역: {statn_nm}")
                break

            data = response.json()
            rows = data.get("realtimeArrivalList", [])
            all_data.extend(rows)

            if len(rows) < batch_size:
                break
            start += batch_size
        except Exception as e:
            print(f"⚠️ [{statn_nm}] 요청 중 오류 발생: {e}")
            break
    return all_data

# ✅ 3. 저장 폴더 생성
output_dir = "subway_arrivals_by_station"
os.makedirs(output_dir, exist_ok=True)

# ✅ 4. 전체 역에 대해 반복 수집 및 저장
apikey = "4870596749616c6a373677585a6757"
total_saved = 0

for name in station_names:
    print(f"\n🚏 [{name}] 도착 정보 조회 중...")
    result = get_all_arrivals(name, apikey)
    if result:
        filename = f"{output_dir}/{name}.json"
        try:
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            print(f"✅ 저장 완료: {filename} ({len(result)}건)")
            total_saved += len(result)
        except Exception as e:
            print(f"❌ 저장 실패: {filename} → {e}")
    else:
        print("❗ 도착 정보 없음 또는 실패")
    time.sleep(0.2)

print(f"\n✅ 전체 저장 완료: 총 {total_saved}건, 파일 수: {len(station_names)}")
