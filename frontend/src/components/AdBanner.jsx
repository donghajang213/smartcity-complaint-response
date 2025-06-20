// src/components/AdBanner.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import classnames from 'classnames';

export default function AdBanner() {
  const [ads, setAds] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // 광고 리스트 API 호출
    axios.get('/admin/ads')
      .then(res => setAds(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    // 5초마다 배너 순환
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [ads]);

  if (!ads.length) {
    return <div className={classnames('p-2 text-center', 'text-gray-500')}>광고 준비 중...</div>;
  }

  const ad = ads[current];
  return (
    <div className={classnames('p-2 flex items-center justify-center')}>
      <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer">
        <img src={ad.imageUrl} alt={ad.altText || '광고'} className="max-h-48 object-contain" />
      </a>
    </div>
  );
}