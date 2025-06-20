// src/components/Chart/Todays_Accessor.jsx
import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { StatsAPI } from '../../api/auth';

function TodaysAccessorChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    StatsAPI.getTodayAccessors()
      .then(res => setData(res.data || []))
      .catch(err => console.error(
        '오늘 접속자 차트 불러오기 실패:',
        err.response?.data || err.message
      ));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" />
        <Line type="monotone" dataKey="count" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default TodaysAccessorChart;
