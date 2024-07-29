import React from 'react';
import { createBrowserRouter, RouterProvider, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Library from './pages/Library';
import AddText from './pages/AddText';
import ImportFromFile from './pages/ImportFromFile';
import ImportFromURL from './pages/ImportFromURL';
import EditText from './pages/EditText';
import Login from './pages/Login'
import Register from './pages/Register'
import NavBar from './components/NavBar';
import firebaseConfig from './config/firebaseConfig';
import { initializeApp } from 'firebase/app';

const app = initializeApp(firebaseConfig);


const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/library",
      element: <Library />
    },
    {
      path: "/addtext",
      element: <AddText />
    },
    {
      path: "/importfromfile",
      element: <ImportFromFile />
    },
    {
      path: "/importfromurl",
      element: <ImportFromURL />
    },
    {
      path: "/edittext/:title",
      element: <EditText />
    },
  ])

  return (
    <>
      <NavBar />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
};

export default App;