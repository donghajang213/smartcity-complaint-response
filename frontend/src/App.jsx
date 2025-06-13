import { GoogleOAuthProvider } from '@react-oauth/google';
import Router from "./routes/Router";


function App() {
  return (
    <GoogleOAuthProvider clientId="360808269616-fr8sj0ddjvhejb6o9tjulbb11rr276ov.apps.googleusercontent.com">
      <Router />
    </GoogleOAuthProvider>
  );
}

export default function App() {
  return <Router />;
}
