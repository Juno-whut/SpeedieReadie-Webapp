// src/pages/Profile.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { updateEmail, updatePassword } from 'firebase/auth';

const Profile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || '');
          setEmail(userData.email || '');
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);

        // Update email in auth and Firestore
        if (email !== auth.currentUser.email) {
          await updateEmail(auth.currentUser, email);
        }

        await updateDoc(userDocRef, {
          username,
          email,
        });

        // Update password if provided
        if (newPassword) {
          await updatePassword(auth.currentUser, newPassword);
        }

        setMessage('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <h1>Profile</h1>
      <form onSubmit={handleUpdateProfile}>
        <TextInput
          id="username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <TextInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <TextInput
          id="newPassword"
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />
        <Button type="submit">Update Profile</Button>
      </form>
      {message && <p>{message}</p>}
      <Button type="button" onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Profile;
