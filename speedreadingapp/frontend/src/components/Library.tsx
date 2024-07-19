import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Library: React.FC = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        axios.get('/api/books/')
            .then(response => setBooks(response.data))
            .catch(error => console.error('Error fetching books:', error));
    }, []);

    return (
        <div>
            <h1>Library</h1>
            <ul>
                {books.map((book: any) => (
                    <li key={book.id}>{book.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Library;
