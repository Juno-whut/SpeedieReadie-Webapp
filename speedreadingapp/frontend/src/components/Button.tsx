// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type, onClick, children }) => {
  return (
    <button type={type} className="btn btn-primary" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

