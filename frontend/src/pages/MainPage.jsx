import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import AdBanner from '../components/AdBanner';
import { fetchCategoryStats } from '../api/statApi';
import CategoryBarChart from '../components/stats/CategoryBarChart';
import CategoryPieChart from '../components/stats/CategoryPieChart';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, LineChart, Line, ResponsiveContainer
} from 'recharts';

import axios from '../api/auth';

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
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get('/api/user/profile')
      .then(res => setUser({ role: res.data.role }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCategoryStats();
        setChartData(data);
      } catch (error) {
        console.error("통계 데이터를 불러오는 중 오류 발생:", error);
      }
    };
    loadData();
  }, []);

  const goToChatbot = () => navigate('/chatbot');
  const goToAdmin = () => navigate('/admin/dashboard');

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      
      {/* 관리자 전용 버튼 */}
      {user.role === 'ADMIN' && (
        <div className="flex justify-end">
          <Button className="bg-red-600 text-white hover:bg-red-700" onClick={goToAdmin}>
            관리자 대시보드
          </Button>
        </div>
      )}

      {/* Hero 카드 */}
      <Card className="rounded-2xl shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">🤖 SmartCity Chat Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          <p className="text-gray-700">
            실시간 챗봇 통계와 다양한 기능을 한눈에 확인해보세요.  
            궁금한 점이 있다면 챗봇에 직접 질문해보는 것도 가능합니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryBarChart data={chartData} />
            <CategoryPieChart data={chartData} />
          </div>

          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700 mt-6"
            onClick={goToChatbot}
          >
            지금 챗봇 사용해보기
          </Button>
        </CardContent>
      </Card>

      {/* 시간대/월별 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-md bg-white">
          <CardHeader>
            <CardTitle>⏰ 시간대별 질문량</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md bg-white">
          <CardHeader>
            <CardTitle>📈 월별 질문 추이</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 광고 배너: 하단 고정 */}
      <div className="mt-12 border-t pt-8">
        <AdBanner position="main-banner" limit={3} />
      </div>
    </div>
  );
}
