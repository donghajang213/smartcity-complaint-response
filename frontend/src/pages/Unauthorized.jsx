export default function Unauthorized() {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>접근 권한이 없습니다.</h1>
      <p>이 페이지를 볼 수 있는 권한이 없습니다. 관리자만 접근 가능합니다.</p>
    </div>
  );
}