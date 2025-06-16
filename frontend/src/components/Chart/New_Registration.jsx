import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import dayjs from 'dayjs';

const New_Registration = ({ users }) => {
  // 최근 7일 날짜 배열 생성 (예: ['06-10', '06-11', ...])
  const last7Days = Array.from({ length: 7 }, (_, i) =>
    dayjs().subtract(6 - i, 'day').format('MM-DD')
  );

  // 날짜별 신규 가입자 수 계산
  const registrationsPerDay = last7Days.map((date) => {
    return users.filter((user) =>
      dayjs(user.createdAt).format('MM-DD') === date
    ).length;
  });

  const data = {
    labels: last7Days,
    datasets: [
      {
        label: '최근 7일 신규 등록',
        data: registrationsPerDay,
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
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default New_Registration;
