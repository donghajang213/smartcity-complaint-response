import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { useNavigate } from "react-router-dom";
import AdBanner from "../components/AdBanner";
import { fetchCategoryStats } from "../api/statApi";
import CategoryBarChart from "../components/stats/CategoryBarChart";
import CategoryPieChart from "../components/stats/CategoryPieChart";
import { Bot } from "lucide-react";
import { fetchHourlyStats } from '../api/statApi';
import HourlyBarChart from '../components/stats/HourlyBarChart';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import axios from "../api/auth";

const hourlyData = [
  { hour: "00", count: 10 },
  { hour: "01", count: 8 },
  { hour: "02", count: 5 },
  { hour: "23", count: 12 }
];

export default function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ role: 'FREE' });
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [hourlyChartData, setHourlyChartData] = useState([]);

  useEffect(() => {
    axios
      .get("/api/user/profile")
      .then((res) => setUser({ role: res.data.role }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCategoryStats();
        setCategoryChartData(data);
      } catch (error) {
        console.error("카테고리별 통계 데이터를 불러오는 중 오류 발생:", error);
      }
    };
    loadData();
  }, []);

  const goToChatbot = () => navigate('/chatbot');
  const goToAdmin = () => navigate('/admin/dashboard');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchHourlyStats();
        const currentHour = new Date().getHours();
        const reordered = [
          ...data.slice(currentHour + 1),
          ...data.slice(0, currentHour + 1),
        ];

        setHourlyChartData(reordered);
      } catch (error) {
        console.error("시간대별 통계 데이터를 불러오는 중 오류 발생:", error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

        {/* 관리자 전용 버튼 */}
        {user.role === "ADMIN" && (
          <div className="flex justify-end">
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={goToAdmin}>
              관리자 대시보드
            </Button>
          </div>
        )}

        {/* 챗봇 소개 섹션 */}
        <Card className="bg-gradient-to-r from-indigo-100 via-white to-indigo-50 rounded-3xl shadow-xl border border-gray-200">
          <CardContent className="px-8 py-12 text-center space-y-6 flex flex-col items-center justify-center">
            <div className="bg-indigo-600 text-white rounded-full p-4 shadow-lg">
              <Bot className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-extrabold text-indigo-700">SmartCity 챗봇</h2>
            <p className="text-gray-800 text-lg leading-relaxed max-w-xl">
              실시간 민원 응답, 날씨 및 미세먼지 정보 등 다양한 도시 데이터를<br />
              스마트한 챗봇을 통해 빠르게 확인해보세요.
            </p>
            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3 text-lg rounded-full transform transition-transform hover:scale-105"
              onClick={goToChatbot}
            >
              🤖 지금 챗봇 사용해보기
            </Button>
          </CardContent>
        </Card>

        {/* 대시보드 차트 */}
        <Card className="rounded-2xl shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">📊 SmartCity 대시보드</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-10 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 파이 차트 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">카테고리별 민원 비율</h3>
                <CategoryPieChart data={categoryChartData} />
              </div>

              {/* 시간대별 질문량 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">시간대별 질문량</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <HourlyBarChart data={hourlyChartData} />
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 광고 배너 */}
        <div className="mt-12 border-t pt-8">
          <AdBanner position="main-banner" limit={3} />
        </div>
      </div>
    </div>
  );
}
