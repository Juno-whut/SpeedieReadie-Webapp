// frontend/src/pages/Profile.tsx

import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../auth';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const profileData = await getUserProfile(user.uid);
        setProfile(profileData);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProfile();
      } else {
        setProfile(null);
      }
    });
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      {profile ? (
        <div>
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
          <p>Settings:</p>
          <ul>
            <li>WPM: {profile.settings.wpm}</li>
            <li>Chunk Size: {profile.settings.chunk_size}</li>
            <li>Font Size: {profile.settings.font_size}</li>
            <li>Text Color: {profile.settings.text_color}</li>
            <li>Background Color: {profile.settings.background_color}</li>
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
