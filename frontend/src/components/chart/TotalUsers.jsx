// src/components/chart/TotalUsersChart.jsx
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { StatsAPI } from '../../api/auth';

function TotalUsersChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    StatsAPI.getTotalUsers()
      .then(res => setData(res.data || []))
      .catch(err => console.error(
        '전체 사용자 차트 불러오기 실패:',
        err.response?.data || err.message
      ));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TotalUsersChart;
