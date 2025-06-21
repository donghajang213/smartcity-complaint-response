// import { useEffect, useState } from "react";
// import axios from "axios";

// const AdminPending = () => {
//   const [users, setUsers] = useState([]);

//   const fetchPendingUsers = async () => {
//     try {
//       const token = localStorage.getItem("jwt");
//       const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/pending`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUsers(res.data);
//     } catch (err) {
//       console.error("조회 실패:", err);
//       alert("승인 대기 유저 조회 실패");
//     }
//   };

//   const approveUser = async (userId) => {
//     try {
//       const token = localStorage.getItem("jwt");
//       await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}/approve`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       alert("승인 완료!");
//       fetchPendingUsers(); // 갱신
//     } catch (err) {
//       console.error("승인 실패:", err);
//       alert("승인 실패");
//     }
//   };

//   useEffect(() => {
//     fetchPendingUsers();
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">관리자 승인 대기 목록</h2>
//       {users.length === 0 ? (
//         <p>승인 대기 중인 관리자가 없습니다.</p>
//       ) : (
//         <ul className="space-y-4">
//           {users.map((user) => (
//             <li key={user.userId} className="border p-4 rounded shadow">
//               <p><strong>이름:</strong> {user.name}</p>
//               <p><strong>이메일:</strong> {user.email}</p>
//               <p><strong>상태:</strong> {user.status}</p>
//               <button
//                 onClick={() => approveUser(user.userId)}
//                 className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//               >
//                 승인
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default AdminPending;
