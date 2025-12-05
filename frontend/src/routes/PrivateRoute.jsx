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
  if (!token) return <Navigate to="/login" replace />;

  const userInfo = parseJwt(token);
  console.log("디코딩된 사용자 정보:", userInfo);

  if (!userInfo) return <Navigate to="/login" replace />;

  if (roles.length === 0) return element;

  if (userInfo.roles.some(role => roles.includes(role))) {
    return element;
  }

  return <Navigate to="/unauthorized" replace />;
}
