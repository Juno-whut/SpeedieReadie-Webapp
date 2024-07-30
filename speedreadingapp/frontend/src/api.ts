// src/api.ts
import axios, { AxiosResponse } from 'axios';

// Define the base URL for the Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});



// Define API functions
export const fetchLibrary = async (): Promise<Book[]> => {
  const response: AxiosResponse<Book[]> = await axiosInstance.get('/library/');
  return response.data;
};

export const deleteBook = async (bookId: string): Promise<void> => {
  const response: AxiosResponse<void> = await axiosInstance.delete(`/library/${bookId}/`);
  return response.data;
};

export const addText = async (title: string, text: string): Promise<void> => {
  const response: AxiosResponse<void> = await axiosInstance.post('/add_text/', { title, text });
  return response.data;
};

export const addBookFromFile = async (title: string, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('file', file);

  const response: AxiosResponse<void> = await axiosInstance.post('/import_from_file/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const addBookFromURL = async (title: string, url: string): Promise<void> => {
  const response: AxiosResponse<void> = await axiosInstance.post('/import_from_url/', { title, url });
  return response.data;
};

// Define the Book interface
interface Book {
  id: string;
  title: string;
  // Add other fields if necessary
}

export default axiosInstance;
