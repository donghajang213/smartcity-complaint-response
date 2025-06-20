// src/components/chart/TotalUsersChart.jsx
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

function TotalUsersChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.warn('No JWT, skipping TotalUsersChart fetch');
      return;
    }

    axios.get('/api/admin/dashboard/total-users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      // 백엔드에서 [{ date: "...", count: 123 }, ...] 형태로 리턴한다고 가정
      setData(res.data);
    })
    .catch(err => {
      console.error('TotalUsersChart 데이터 로드 실패:', err);
    });
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
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TotalUsersChart;
