// src/components/Chart/New_Registration.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function NewRegistrationChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/admin/stats/new-registrations')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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