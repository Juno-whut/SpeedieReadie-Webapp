import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { db } from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const AddText: React.FC = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleSaveText = async () => {
    if (!title || !text) {
      console.error("Title or text is missing");
      return;
    }
    // Split text into chunks and save to Firebase
    const chunks = text.match(/.{1,1024}/g) || [];
    const bookRef = doc(db, 'books', title);
    for (let i = 0; i < chunks.length; i++) {
      await setDoc(doc(bookRef, 'chunks', i.toString()), { content: chunks[i] });
    }
    await setDoc(bookRef, { title, totalChunks: chunks.length });

    navigate('/library');
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
