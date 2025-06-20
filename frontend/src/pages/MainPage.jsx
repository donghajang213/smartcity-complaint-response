// src/pages/MainPage.jsx
import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, LineChart, Line
} from 'recharts';
import axios from '../api/auth'; // 프로필 API 호출용

// 더미 데이터 예시
const hourlyData = [
  { hour: '00', count: 10 },
  { hour: '01', count: 8 },
  { hour: '02', count: 5 },
  { hour: '23', count: 12 },
];
const monthlyData = [
  { month: 'Jan', count: 120 },
  { month: 'Feb', count: 150 },
  { month: 'Dec', count: 200 },
];

export default function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ role: 'FREE' });

  // 마운트 시 프로필 정보 로드
  useEffect(() => {
    axios.get('/api/user/profile')
      .then(res => {
        setUser({ role: res.data.role });
      })
      .catch(() => {
        // 프로필 로드 실패 시, 필요하다면 로그인으로 리다이렉트
      });
  }, []);

  const goToChatbot = () => navigate('/chatbot');
  const goToAdmin = () => navigate('/admin/dashboard');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ADMIN 전용 버튼 */}
      {user.role === 'ADMIN' && (
        <Button
          className="bg-red-600 text-white"
          onClick={goToAdmin}
        >
          관리자 대시보드
        </Button>
      )}

      {/* Hero Section */}
      <Card className="rounded-2xl shadow p-4">
        <CardHeader>
          <CardTitle className="text-xl">SmartCity Chat Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>실시간 챗봇 통계와 다양한 기능을 한눈에 확인하세요.</p>
          <Button className="mt-4" onClick={goToChatbot}>
            챗봇으로 이동
          </Button>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow">
          <CardHeader>
            <CardTitle>시간대별 질문량</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={500} height={300} data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardHeader>
            <CardTitle>월별 질문 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={500} height={300} data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </CardContent>
        </Card>
      </div>

      {/* Ads Section */}
      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle>광고 배너</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg">
            <img
              src="/ads/banner1.jpg"
              alt="광고"
              className="w-full h-auto object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Features Suggestions */}
      <Card className="rounded-2xl shadow p-4">
        <CardHeader>
          <CardTitle>추가 기능 제안</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>사용자 로그인/권한 관리</li>
            <li>통계 필터링(기간, 카테고리별)</li>
            <li>다크 모드 토글</li>
            <li>알림 및 실시간 업데이트(웹소켓)</li>
            <li>CSV/Excel 통계 다운로드</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
