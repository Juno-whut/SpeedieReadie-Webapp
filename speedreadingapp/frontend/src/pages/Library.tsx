// frontend/src/pages/Library.tsx

import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Library: React.FC = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      const user = auth.currentUser;
      if (user) {
        const libraryRef = collection(db, 'users', user.uid, 'library');
        const librarySnapshot = await getDocs(libraryRef);
        const libraryBooks = librarySnapshot.docs.map(doc => doc.data());
        setBooks(libraryBooks);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchLibrary();
      } else {
        setBooks([]);
      }
    });
  }, []);

  return (
    <div>
      <h1>Library</h1>
      <ul>
        {books.map((book, index) => (
          <li key={index}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Library;
