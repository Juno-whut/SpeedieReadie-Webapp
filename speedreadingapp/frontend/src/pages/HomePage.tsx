// src/pages/HomePage.tsx
import React from 'react';
import Navigation from '../components/NavBar';
import { Container, Row, Col } from 'react-bootstrap';

const HomePage: React.FC = () => {
  return (
    <>
      <Navigation />
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h1>Welcome to Speedie Readie</h1>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;



