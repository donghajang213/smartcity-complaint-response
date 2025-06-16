import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Server_Network_Status = () => {
  const data = {
    labels: ['0~4시', '4~8시', '8~12시', '12~16시', '16~20시', '20~24시'],
    datasets: [
      {
        label: '백엔드 요청 수',
        data: [12, 19, 3, 5, 2, 3], // 데이터 등록
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default Server_Network_Status;