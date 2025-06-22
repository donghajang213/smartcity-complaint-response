import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import AdBanner from '../components/AdBanner';
import { fetchCategoryStats  } from '../api/statApi';
import CategoryBarChart from '../components/stats/CategoryBarChart';
import CategoryPieChart from '../components/stats/CategoryPieChart';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, LineChart, Line
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

  useEffect(() => {
    axios.get('/api/user/profile')
      .then(res => setUser({ role: res.data.role }))
      .catch(() => {});
  }, []);

  const goToChatbot = () => navigate('/chatbot');
  const goToAdmin = () => navigate('/admin/dashboard');

  const [chartData, setChartData] = useState([]);
  
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 관리자 전용 버튼 */}
      {user.role === 'ADMIN' && (
        <Button className="bg-red-600 text-white" onClick={goToAdmin}>
          관리자 대시보드
        </Button>
      )}

      {/* 광고 항상 고정 표시 */}
      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle>광고 배너</CardTitle>
        </CardHeader>
        <CardContent>
          <AdBanner position="main-banner" limit={3} />
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card className="rounded-2xl shadow p-4">
        <CardHeader>
          <CardTitle className="text-xl">SmartCity Chat Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>실시간 챗봇 통계와 다양한 기능을 한눈에 확인하세요.</p>
          <div>
            <h2>카테고리별 질문 통계</h2>
            <CategoryBarChart data={chartData} />
            <CategoryPieChart data={chartData} />
        </div>
          <Button className="mt-4" onClick={goToChatbot}>
            챗봇으로 이동
          </Button>
        </CardContent>
      </Card>

      {/* 통계 시각화 */}
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
    </div>
  );
}
