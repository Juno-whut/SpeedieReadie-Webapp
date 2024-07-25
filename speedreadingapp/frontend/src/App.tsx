import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Library from './pages/Library';
import AddText from './pages/AddText';
import ImportFromFile from './pages/ImportFromFile';
import ImportFromURL from './pages/ImportFromURL';
import EditText from './pages/EditText';
import Login from './pages/Login'
import Register from './pages/Register'
import NavBar from './components/NavBar';

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/library" element={<Library />} />
        <Route path="/addtext" element={<AddText />} />
        <Route path="/importfromfile" element={<ImportFromFile />} />
        <Route path="/importfromurl" element={<ImportFromURL />} />
        <Route path="/edittext/:title" element={<EditText />} />
      </Routes>
    </Router>
  );
};

export default App;
