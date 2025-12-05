// src/components/Chart/Server_Network_Status.jsx
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

function ServerNetworkStatusChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    StatsAPI.getNetworkHistory()
      .then(res => setData(res.data || []))
      .catch(err => console.error(
        '네트워크 현황 차트 불러오기 실패:',
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
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="throughput" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ServerNetworkStatusChart;
