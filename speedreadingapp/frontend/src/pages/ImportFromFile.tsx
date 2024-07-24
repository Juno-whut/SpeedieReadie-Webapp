import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { db } from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const ImportFromFile: React.FC = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!title || !file) {
      console.error("Title or file is missing");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      navigate('/edittext', { state: { title, text } });
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <h1>Import From File</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={50}
      />
      <input type="file" onChange={handleFileChange} />
      <Button type="button" onClick={handleImport}>
        Import Book
      </Button>
    </div>
  );
};

export default ImportFromFile;
