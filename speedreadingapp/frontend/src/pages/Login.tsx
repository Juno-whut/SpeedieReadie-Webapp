// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then ((userCredential) => {
        const user = userCredential.user;
        navigate('/Library');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      })
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="email" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
export default Login;
