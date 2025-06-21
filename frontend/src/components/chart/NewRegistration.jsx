// src/components/Chart/New_Registration.jsx
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { StatsAPI } from '../../api/auth';

function NewRegistrationChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    StatsAPI.getNewRegistrations()
      .then(res => setData(res.data || []))
      .catch(err => console.error(
        '신규 가입자 차트 불러오기 실패:',
        err.response?.data || err.message
      ));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default NewRegistrationChart;
