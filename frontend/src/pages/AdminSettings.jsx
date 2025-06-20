// pages/AdminSettings.jsx
import React, { useEffect, useState } from 'react';
import { Switch } from '../components/ui/Switch';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Upload } from 'lucide-react';
import { AdsAPI } from '../api/auth';
import axios from '../api/auth';

export default function AdminSettings() {
  const [adEnabled, setAdEnabled] = useState(true);
  const [ads, setAds] = useState([]);
  const [newAd, setNewAd] = useState({ file: null, linkUrl: '', position: 'main-banner' });

  useEffect(() => {
    fetchAds();
    AdsAPI.getStatus().then(res => {
      setAdEnabled(res.data?.enabled ?? true);
    });
  }, []);

  const fetchAds = async () => {
    try {
      const res = await AdsAPI.getAds();
      setAds(res.data);
    } catch (err) {
      console.error('광고 불러오기 실패', err);
    }
  };

  const toggleAdStatus = () => {
    setAdEnabled(!adEnabled);
    AdsAPI.toggleStatus(!adEnabled);
  };

  const handlePriorityChange = (index, direction) => {
    const updatedAds = [...ads];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= ads.length) return;

    [updatedAds[index], updatedAds[targetIndex]] = [updatedAds[targetIndex], updatedAds[index]];
    setAds(updatedAds);
    AdsAPI.reorderAds(updatedAds.map((ad, i) => ({ id: ad.id, orderIndex: i })));
  };

  const handleDeleteAd = async (id) => {
    await AdsAPI.deleteAd(id);
    fetchAds();
  };

  const handleFileChange = (e) => {
    setNewAd(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleAdUpload = async () => {
    const formData = new FormData();
    formData.append('file', newAd.file);
    formData.append('linkUrl', newAd.linkUrl);
    formData.append('position', newAd.position);
    await axios.post('/api/admin/ads/upload', formData);
    setNewAd({ file: null, linkUrl: '', position: 'main-banner' });
    fetchAds();
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">📢 광고 설정</h2>

      {/* 광고 ON/OFF */}
      <div className="flex items-center gap-4">
        <span className="text-lg font-medium">광고 노출</span>
        <Switch checked={adEnabled} onCheckedChange={toggleAdStatus} />
        <span>{adEnabled ? 'ON' : 'OFF'}</span>
      </div>

      {/* 광고 업로드 */}
      <div className="space-y-2">
        <h3 className="font-semibold">광고 등록</h3>
        <Input type="file" onChange={handleFileChange} />
        <Input
          placeholder="광고 링크 (클릭 시 이동할 URL)"
          value={newAd.linkUrl}
          onChange={(e) => setNewAd({ ...newAd, linkUrl: e.target.value })}
        />
        <select
          value={newAd.position}
          onChange={(e) => setNewAd({ ...newAd, position: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="main-banner">메인 배너</option>
          <option value="chat-left">채팅 왼쪽 광고</option>
          <option value="chat-right">채팅 오른쪽 광고</option>
        </select>
        <Button onClick={handleAdUpload} className="mt-2">
          <Upload size={16} className="mr-2" /> 업로드
        </Button>
      </div>

      {/* 광고 목록 + 순서조정 + 삭제 */}
      <div className="space-y-4">
        <h3 className="font-semibold">업로드된 광고</h3>
        {ads.map((ad, index) => (
          <div key={ad.id} className="flex items-center justify-between p-2 border rounded-md">
            <img src={ad.imageUrl} alt="ad" className="h-16 object-contain" />
            <div className="flex-1 px-4">
              <div className="text-sm text-gray-600">{ad.linkUrl}</div>
              <div className="text-xs text-gray-500">위치: {ad.position}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handlePriorityChange(index, 'up')}>⬆️</Button>
              <Button size="sm" onClick={() => handlePriorityChange(index, 'down')}>⬇️</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDeleteAd(ad.id)}>삭제</Button>
            </div>
          </div>
        ))}
      </div>

      {/* 광고 통계 (클릭 수 등) */}
      <div className="space-y-2">
        <h3 className="font-semibold">📊 광고 통계</h3>
        {ads.map((ad) => (
          <div key={ad.id} className="text-sm text-gray-700">
            {ad.linkUrl} — 클릭 수: {ad.clickCount || 0} — 위치: {ad.position}
          </div>
        ))}
      </div>
    </div>
  );
}
