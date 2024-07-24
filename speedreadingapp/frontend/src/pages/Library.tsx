import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import Button from '../components/Button';

interface Book {
  id: string;
  title: string;
}

const Library: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const libraryBooks: Book[] = [];
      const querySnapshot = await getDocs(collection(db, 'books'));
      querySnapshot.forEach((doc) => {
        const data = doc.data() as { title: string };
        libraryBooks.push({ id: doc.id, title: data.title });
      });
      setBooks(libraryBooks);
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Library</h1>
      <div>
        <Button type="button" onClick={() => navigate('/addtext')}>Add Text</Button>
        <Button type="button" onClick={() => navigate('/importfromfile')}>Import from File</Button>
        <Button type="button" onClick={() => navigate('/importfromurl')}>Import from URL</Button>
      </div>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Library;
