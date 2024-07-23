// src/pages/Library.tsx

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';

const Library: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (auth.currentUser) {
        const querySnapshot = await getDocs(collection(db, 'users', auth.currentUser.uid, 'library'));
        const libraryBooks = querySnapshot.docs.map(doc => doc.data());
        setBooks(libraryBooks);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container mt-5">
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
