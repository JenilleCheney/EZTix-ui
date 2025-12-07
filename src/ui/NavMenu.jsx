import React from 'react'
import{Link, useLocation} from "react-router-dom"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import logo from '../assets/EZTixLogo.jpg'

const NavMenu = ({ searchTerm, onSearchChange }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
       <>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src={logo}
              height="80"
              className="d-inline-block align-top"
              alt="EZ Tix Logo"
            />
            {' '}
            
          </Navbar.Brand>
          <Nav className="me-auto d-flex align-items-center">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <span className="mx-2">|</span>
              <Nav.Link as={Link} to="/Details">Details</Nav.Link>
              <span className="mx-2">|</span>
              <Nav.Link as={Link} to="/Tickets">Tickets</Nav.Link>
          </Nav>
          {isHomePage && (
            <Form className="d-flex ms-4">
              <Form.Control
                type="search"
                placeholder="Search Shows ..."
                className="me-2"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </Form>
          )}
        </Container>
      </Navbar>
   </>
  )
}

export default NavMenu
