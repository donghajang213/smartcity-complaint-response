// src/components/Chart/Server_Uptime.jsx
import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { StatsAPI } from '../../api/auth';

function ServerUptimeChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    StatsAPI.getUptimeHistory()
      .then(res => setData(res.data || []))
      .catch(err => console.error(
        '업타임 차트 불러오기 실패:',
        err.response?.data || err.message
      ));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="status"
          outerRadius={100}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default ServerUptimeChart;
