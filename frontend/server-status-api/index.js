const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5173;

app.use(cors()); // React에서 API 호출 허용

// 실제 서버 상태 데이터 (예시)
let serverStatus = {
  networkStatus: '정상',
  averageTraffic: '120MB/s',
  mainServer: '정상',
  proxyServer: '정상',
  databaseServer: '문제 발생 중',
};

// API 엔드포인트: 서버 상태 데이터 반환
app.get('/api/server-status', (req, res) => {
  res.json(serverStatus);
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`API 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
