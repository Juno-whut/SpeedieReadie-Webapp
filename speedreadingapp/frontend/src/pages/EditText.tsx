import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { getCookie } from '../utils'; // Import your utility function to get the CSRF token

const EditText: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, text } = location.state as { title: string; text: string };
  const [editedText, setEditedText] = useState(text);

  const handleSaveText = async () => {
    const csrfToken = getCookie('csrftoken');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const response = await fetch('/api/save_text/', {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, text: editedText }),
    });

    if (response.ok) {
      navigate('/library');
    } else {
      console.error('Error saving text');
    }
  };

  return (
    <div>
      <h1>Edit Text</h1>
      <textarea
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        placeholder="Edit your text here..."
      />
      <Button type="button" onClick={handleSaveText}>
        Save Book
      </Button>
    </div>
  );
};

export default EditText;
