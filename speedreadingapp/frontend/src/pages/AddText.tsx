import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addText } from '../api';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

const AddText: React.FC = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleSaveText = async () => {
    try {
      await addText(title, text);
      navigate('/library');
    } catch (error) {
      console.error('Error saving text:', error);
    }
  };

  return (
    <div>
      <h1>Add Text</h1>
      <TextInput
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        label="Title"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here"
      />
      <Button type="button" onClick={handleSaveText}>Save Text</Button>
    </div>
  );
};

export default AddText;
