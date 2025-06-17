import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
const options = {
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5,  // 여기만 추가
      },
    },
  },
};
const Todays_Accessor = () => {
  const [labels, setLabels] = useState([]);
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    axios.get('/api/users/today-visitors-per-3hour')
      .then(res => {
        setLabels(res.data.labels);
        setCounts(res.data.counts);
      })
      .catch(err => {
        console.error("3시간 단위 접속자 데이터 불러오기 오류:", err);
      });
  }, []);
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: '3시간 단위 접속자 수',
        data: counts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} />;
};

export default Todays_Accessor;
