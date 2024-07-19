// frontend/src/pages/Profile.tsx

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface UserSettings {
  wpm: number;
  chunk_size: number;
  font_size: number;
  text_color: string;
  background_color: string;
}

interface UserProfile {
  username: string;
  email: string;
  settings: UserSettings;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid);
        const userDocSnapshot = await getDoc(userDoc);
        if (userDocSnapshot.exists()) {
          setUser(userDocSnapshot.data() as UserProfile);
        }
      }
    });
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <h2>Settings</h2>
      <p>WPM: {user.settings.wpm}</p>
      <p>Chunk Size: {user.settings.chunk_size}</p>
      <p>Font Size: {user.settings.font_size}</p>
      <p>Text Color: {user.settings.text_color}</p>
      <p>Background Color: {user.settings.background_color}</p>
    </div>
  );
};

export default Profile;
