import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import '../styles/NavBar.css';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("User signed in:", user);
      } else {
        setUser(null);
        console.log("No user signed in");
      }
    });
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Speedie Readie</Link>
        <div className="navbar-right">
          <Link to="/" className="nav-item">Home</Link>
          {user ? (
            <>
              <Link to="/profile" className="nav-item">Profile</Link>
              <Link to="/library" className="nav-item">Library</Link>
              <Link to="/" className="nav-item" onClick={handleLogout}>Logout</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/register" className="nav-item">Register</Link>
            </>
          )}
        </div>
        <button className="navbar-toggle" onClick={handleToggle}>
          ☰
        </button>
      </div>
      <div className={`mobile-menu ${isOpen ? 'show' : ''}`}>
        <Link to="/" className="nav-item" onClick={handleToggle}>Home</Link>
        {user ? (
          <>
            <Link to="/profile" className="nav-item" onClick={handleToggle}>Profile</Link>
            <Link to="/library" className="nav-item" onClick={handleToggle}>Library</Link>
            <Link to="/" className="nav-item" onClick={() => { handleLogout(); handleToggle(); }}>Logout</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item" onClick={handleToggle}>Login</Link>
            <Link to="/register" className="nav-item" onClick={handleToggle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

