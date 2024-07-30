import React, { ChangeEvent } from 'react';

interface TextInputProps {
  id: string;
  label: string;
  type?: string;  // type is optional because it won't be used for textarea
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  multiline?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ id, label, type = 'text', value, onChange, placeholder, multiline = false }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-control"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-control"
        />
      )}
    </div>
  );
};

export default TextInput;
