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
    <div className="p-8 space-y-10 max-w-5xl mx-auto text-gray-800">
      <h2 className="text-3xl font-bold">📢 광고 설정</h2>

      {/* 광고 ON/OFF */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="text-lg font-semibold">광고 노출 상태</div>
        <div className="flex items-center gap-4">
          <Switch checked={adEnabled} onCheckedChange={toggleAdStatus} />
          <span className={`text-sm font-medium ${adEnabled ? 'text-green-600' : 'text-gray-500'}`}>
            {adEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* 광고 업로드 */}
      <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
        <h3 className="text-xl font-semibold">➕ 광고 등록</h3>
        <Input type="file" onChange={handleFileChange} />
        <Input
          placeholder="광고 링크 (클릭 시 이동할 URL)"
          value={newAd.linkUrl}
          onChange={(e) => setNewAd({ ...newAd, linkUrl: e.target.value })}
        />
        <select
          value={newAd.position}
          onChange={(e) => setNewAd({ ...newAd, position: e.target.value })}
          className="border rounded-md p-2 w-full"
        >
          <option value="main-banner">메인 배너</option>
          <option value="chat-left">채팅 왼쪽 광고</option>
          <option value="chat-right">채팅 오른쪽 광고</option>
        </select>
        <Button onClick={handleAdUpload} className="mt-2 flex items-center gap-2">
          <Upload size={16} /> 업로드
        </Button>
      </div>

      {/* 광고 목록 */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">📋 업로드된 광고 목록</h3>
        {ads.length === 0 && (
          <div className="text-sm text-gray-500">등록된 광고가 없습니다.</div>
        )}
        {ads.map((ad, index) => (
          <div key={ad.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
            <div className="w-24 h-16 flex items-center justify-center overflow-hidden rounded-md bg-gray-50 border">
              {ad.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                <video 
                src={ ad.imageUrl.replace(
                          /^(?:https?:\/\/[^\/]+)?\/api\/ads\//,
                          '/static/ads/'
                        ) } 
                        className="h-full object-contain"
                        controls
                        />
                ) : (
                <img
                  src={ ad.imageUrl.replace(
                          /^(?:https?:\/\/[^\/]+)?\/api\/ads\//,
                          '/static/ads/'
                        ) }
                  alt="ad"
                  className="h-full object-contain"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-600 truncate">{ad.linkUrl}</div>
              <div className="text-xs text-gray-500 mt-1">위치: {ad.position}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handlePriorityChange(index, 'up')}>⬆️</Button>
              <Button size="sm" onClick={() => handlePriorityChange(index, 'down')}>⬇️</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDeleteAd(ad.id)}>삭제</Button>
            </div>
          </div>
        ))}
      </div>

      {/* 광고 통계 */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">📊 광고 통계</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ads.map((ad) => (
            <div key={ad.id} className="p-4 border rounded-lg bg-white shadow-sm">
              <div className="text-sm font-semibold text-gray-800 mb-1">{ad.linkUrl}</div>
              <div className="text-xs text-gray-500">
                클릭 수: <span className="font-semibold text-indigo-600">{ad.clickCount || 0}</span> / 위치: <span className="text-gray-700">{ad.position}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
