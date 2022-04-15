import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

export function HomeNavbar(props) {
  let [tabSelected, setTabSelected] = useState(0);
  let navigate = useNavigate();

  return (
    <>
        <Navbar bg="light" expand="lg">
          <Container >
            <Navbar.Brand onClick={() => navigate('/')}>React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={() => navigate('/')}>Play</Nav.Link>
                <Nav.Link onClick={() => navigate('/shop')}>Marketplace</Nav.Link>
                <NavDropdown title="Other" id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={() => navigate('/marketplaceToken')}>Convert gold</NavDropdown.Item>
                  <NavDropdown.Item href="/profile/collection">My collection</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
    </>
  );
}