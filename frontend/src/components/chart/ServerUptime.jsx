// src/components/Chart/Server_Uptime.jsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function ServerUptimeChart() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get('/admin/stats/server-uptime')
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="status" outerRadius={100}>
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