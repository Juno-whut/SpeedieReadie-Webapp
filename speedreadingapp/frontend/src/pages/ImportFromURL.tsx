import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { db } from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const ImportFromURL: React.FC = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleImport = async () => {
    if (!title || !url) {
      console.error("Title or URL is missing");
      return;
    }

    try {
      const response = await fetch(url);
      const text = await response.text();
      navigate('/edittext', { state: { title, text } });
    } catch (error) {
      console.error("Failed to fetch URL:", error);
    }
  };

  return (
    <div>
      <h1>Import From URL</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={50}
      />
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL"
      />
      <Button type="button" onClick={handleImport}>
        Import Book
      </Button>
    </div>
  );
};

export default ImportFromURL;
