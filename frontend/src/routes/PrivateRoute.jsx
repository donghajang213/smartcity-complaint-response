import React from "react";
import { Navigate } from "react-router-dom";

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

export default function PrivateRoute({ element, roles = [] }) {
  const token = localStorage.getItem("jwt");
  if (!token) {
    // 로그인 안 된 상태면 로그인 페이지로
    return <Navigate to="/login" replace />;
  }

  const userInfo = parseJwt(token);
  if (!userInfo) {
    // 토큰 파싱 실패하면 로그인 페이지로
    return <Navigate to="/login" replace />;
  }

  if (roles.length === 0) {
    // 권한 제한 없으면 바로 접근
    return element;
  }

  if (roles.includes(userInfo.role)) {
    // 권한 있으면 접근
    return element;
  }

  // 권한 없으면 권한없음 페이지로 이동
  return <Navigate to="/unauthorized" replace />;
}
