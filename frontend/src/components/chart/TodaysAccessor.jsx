// src/components/Chart/Todays_Accessor.jsx
import React, { useEffect, useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function TodaysAccessorChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/admin/stats/today-accessors')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
export default TodaysAccessorChart;