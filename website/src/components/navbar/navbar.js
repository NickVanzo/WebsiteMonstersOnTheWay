import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

export function HomeNavbar(props) {
  let navigate = useNavigate();

  return (
    <>
      <Navbar expand="lg">
        <Container >
          <Navbar.Brand onClick={() => navigate('/')}>Monsters on the way</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate('/')}>
                <div style={{ whiteSpace: 'nowrap' }} className={'navbar-item'}>
                  <img src="images/console.svg" className="navbar-image"></img>
                  Play
                </div>
              </Nav.Link>
              <Nav.Link onClick={() => navigate('/shop')}>
                <div style={{ whiteSpace: 'nowrap' }} className={'navbar-item'}>
                  <img src="images/store.svg" className="navbar-image"></img>
                  Marketplace
                </div>
              </Nav.Link>
              <div className='navbar-item'>
                <NavDropdown title="Other" id="basic-nav-dropdown">

                  <NavDropdown.Item onClick={() => navigate('/marketplaceToken')}>Convert gold</NavDropdown.Item>
                  <NavDropdown.Item href="/profile/collection">My collection</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>

                </NavDropdown>
              </div>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}