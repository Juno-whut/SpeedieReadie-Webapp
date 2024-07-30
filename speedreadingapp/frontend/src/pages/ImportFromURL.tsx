import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { getCookie } from '../utils'; // Import your utility function to get the CSRF token

const ImportFromURL: React.FC = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleImport = async () => {
    const csrfToken = getCookie('csrftoken');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const response = await fetch('/api/import_from_url/', {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, url }),
    });

    if (response.ok) {
      const data = await response.json();
      navigate('/edittext', { state: { title, text: data.text } });
    } else {
      console.error('Error importing URL');
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
