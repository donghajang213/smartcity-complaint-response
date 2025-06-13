// src/App.jsx
import { GoogleOAuthProvider } from '@react-oauth/google';
import Router from "./routes/Router";

export default function App() {
  return (
    <GoogleOAuthProvider clientId="360808269616-fr8sj0ddjvhejb6o9tjulbb11rr276ov.apps.googleusercontent.com">
      <Router />
    </GoogleOAuthProvider>
  );
}
