import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavigationBar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>Digi Shiksha</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Voice Assistant</Nav.Link>
          <Nav.Link as={Link} to="/digital-learning">Digital Learning</Nav.Link>
          <Nav.Link as={Link} to="/wealth">Wealth Management</Nav.Link>
          <Nav.Link as={Link} to="/ai-anything">Ask AI Anything</Nav.Link>
          <Nav.Link as={Link} to="/notifications">Notifications</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
