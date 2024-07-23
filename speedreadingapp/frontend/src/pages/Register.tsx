// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // You can also save the username in Firestore or Realtime Database
      navigate('/profile');
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Register</h1>
      <TextInput type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <Button onClick={handleRegister}>Register</Button>
    </div>
  );
};

export default Register;
