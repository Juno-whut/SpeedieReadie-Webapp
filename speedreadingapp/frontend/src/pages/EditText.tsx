import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { db } from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const EditText: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, text } = location.state as { title: string; text: string };
  const [editedText, setEditedText] = useState(text);

  const handleSaveText = async () => {
    if (!title) {
      console.error("Title is undefined");
      return;
    }
    // Split text into chunks and save to Firebase
    const chunks = editedText.match(/.{1,1024}/g) || [];
    const bookRef = doc(db, 'books', title);
    for (let i = 0; i < chunks.length; i++) {
      await setDoc(doc(bookRef, 'chunks', i.toString()), { content: chunks[i] });
    }
    await setDoc(bookRef, { title, totalChunks: chunks.length });

    navigate('/library');
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
