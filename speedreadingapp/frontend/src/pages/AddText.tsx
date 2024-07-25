import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { getCookie } from '../utils';

const AddText: React.FC = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleSaveText = async () => {
    const csrfToken = getCookie('csrftoken');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    try {
      const response = await fetch('/api/add_text/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ title, text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error saving text:', errorText);
        throw new Error(`Error saving text: ${response.statusText}`);
      }

      navigate('/library');
    } catch (error) {
      console.error('An error occurred while saving the text:', error);
    }
  };

  return (
    <div>
      <h1>Add Text</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={50}
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
      />
      <Button type="button" onClick={handleSaveText}>
        Save Book
      </Button>
    </div>
  );
};

export default AddText;
