import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Total_users = ({ users }) => {
  // users 배열이 없으면 빈 배열로 초기화
  if (!users) users = [];

  // 월별 사용자 수 집계: 0~11월 인덱스 맞춤 (0=1월)
  const counts = new Array(12).fill(0);

  users.forEach(user => {
    const date = new Date(user.createdAt);
    const month = date.getMonth(); // 0~11
    counts[month]++;
  });

  // labels는 1월~12월
  const labels = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: '월별 총 사용자 수',
        data: counts,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default Total_users;
