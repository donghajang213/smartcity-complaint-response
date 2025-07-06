import React, { useEffect, useState } from 'react';
import { AdsAPI } from '../api/auth';

/**
 * @param {string}  position  광고 위치 키 (백엔드 DB와 정확히 일치해야 합니다)
 * @param {number}  limit     가져올 개수 (기본 3)
 * @param {number}  interval  슬라이드 간격(ms) (기본 5000)
 */
export default function AdBanner({
  position = 'MAIN_BANNER',   // ← 백엔드 값과 맞추세요
  limit = 3,
  interval = 5000,
}) {
  const [ads, setAds] = useState([]);
  const [current, setCurrent] = useState(0);

  // auth.js 와 동일한 방식으로 API_BASE 계산
  const isDev = import.meta.env.MODE === 'development'
  const API_BASE = isDev
    ? ''
    : import.meta.env.VITE_API_ORIGIN || ''

  /* 1) 광고 목록 불러오기 --------------------------------------------------- */
  useEffect(() => {
    async function loadAds() {
      try {
        //const { data } = await AdsAPI.getAdsByPosition(position, limit);
        let { data } = await AdsAPI.getAdsByPosition(position, limit);
        if ((!data || data.length === 0) && position !== 'MAIN_BANNER') {
          console.warn(`No ads for "${position}", falling back to MAIN_BANNER`);
          const fallback = await AdsAPI.getAdsByPosition('MAIN_BANNER', limit);
          data = fallback.data;
        }
        const normalized = (data || []).map(ad => {
          // 1) raw URL 에서 pathname(경로)만 추출
          let raw = ad.imageUrl
          let pathname
          try {
            pathname = new URL(raw).pathname
          } catch {
            pathname = raw
          }
          // 2) /api/ads/ → /static/ads/ 로 교체
          const staticPath = pathname.replace(/^\/api\/ads\//, '/static/ads/')
          // 3) dev는 빈 문자열, prod는 도메인 붙여서 최종 URL 생성
          const url = `${API_BASE}${staticPath}`
          return { ...ad, imageUrl: url }
        })
        setAds(normalized);
        setCurrent(0);
      } catch (e) {
        console.error('광고 로딩 실패:', e);
      }
    }
    if (position) loadAds();
  }, [position, limit, API_BASE]);

  /* 2) 자동 슬라이드 -------------------------------------------------------- */
  useEffect(() => {
    if (ads.length <= 1) return;
    const id = setInterval(
      () => setCurrent(i => (i + 1) % ads.length),
      interval,
    );
    return () => clearInterval(id);
  }, [ads, interval]);

  /* 3) 로딩 중 화면 --------------------------------------------------------- */
  if (ads.length === 0) {
    return (
      <div className="p-2 text-center text-gray-500">
        광고 준비 중...
      </div>
    );
  }

  /* 4) 실제 광고 표시 -------------------------------------------------------- */
  const { id, imageUrl, linkUrl, altText } = ads[current];
  const isVideo = /\.(mp4|webm|ogg)$/i.test(imageUrl);

  const handleClick = () => {
    AdsAPI.incrementClick(id).catch(() => {});
  };

  return (
    <div className="p-2 flex items-center justify-center">
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        {isVideo ? (
          <video
            src={imageUrl}
            controls
            className="max-h-48 object-contain"
          />
        ) : (
          <img
            src={imageUrl}
            alt={altText || '광고'}
            className="max-h-48 object-contain"
          />
        )}
      </a>
    </div>
  );
}
