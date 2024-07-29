import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { signOut, getAuth } from 'firebase/auth';


const NavBar = () => {
  async function handleSignOut() {
    try {
      await signOut(getAuth());
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">Speedie Readie</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/library">Library</Nav.Link>
          <Nav.Link href="/register">Register</Nav.Link>
          <Nav.Link href="/login">Login</Nav.Link>
          <Nav.Link href="/logout">Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
