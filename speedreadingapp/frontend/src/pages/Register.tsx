import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import TextInput from '../components/TextInput';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then ((userCredential) => {
        const user = userCredential.user;
        navigate('/login');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      })
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="email" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
