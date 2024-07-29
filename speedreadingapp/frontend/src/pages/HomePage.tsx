import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const HomePage: React.FC = () => {
  return (
    <>
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
