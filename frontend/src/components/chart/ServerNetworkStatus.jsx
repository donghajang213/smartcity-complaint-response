// src/components/Chart/Server_Network_Status.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function ServerNetworkStatusChart() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get('/admin/stats/server-network')
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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