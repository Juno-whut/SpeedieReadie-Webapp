// src/components/Home.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home: React.FC = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/home/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
};

export default Home;

