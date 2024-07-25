import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { getCookie } from '../utils'; // Import your utility function to get the CSRF token

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
    const formData = new FormData();
    formData.append('title', title);
    if (file) {
      formData.append('file', file);
    }

    const csrfToken = getCookie('csrftoken');

    const headers: HeadersInit = {};
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const response = await fetch('/api/import_from_file/', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      navigate('/edittext', { state: { title, text: data.text } });
    } else {
      console.error('Error importing file');
    }
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
