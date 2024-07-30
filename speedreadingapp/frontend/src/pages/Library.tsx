// src/components/Library.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLibrary, deleteBook } from '../api';
import Button from '../components/Button';
import { getAuth } from 'firebase/auth';

interface Book {
  id: string;
  title: string;
}

const Library: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  const { currentUser } = getAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchLibraryBooks = async () => {
      try {
        const libraryBooks = await fetchLibrary();
        setBooks(libraryBooks);
      } catch (error) {
        console.error('Failed to fetch library:', error);
      }
    };

    fetchLibraryBooks();
  }, [currentUser, navigate]);

  const handleDelete = async (bookId: string) => {
    try {
      await deleteBook(bookId);
      setBooks(books.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  return (
    <div>
      <h1>Your Library</h1>
      <Button type="button" onClick={() => navigate('/add-text')}>Add Text</Button>
      <Button type="button" onClick={() => navigate('/import-from-file')}>Import from File</Button>
      <Button type="button" onClick={() => navigate('/import-from-url')}>Import from URL</Button>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title}
            <Button type="button" onClick={() => handleDelete(book.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Library;
