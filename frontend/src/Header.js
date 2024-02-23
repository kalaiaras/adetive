import React from 'react'
import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container'
import {Nav,Navbar} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function Header() {
let navigate = useNavigate();
  let user =JSON.parse ( localStorage.getItem('user-info'));
  function logOut(){
  localStorage.clear();
  navigate("/login")
  }
  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Adetive</Navbar.Brand>
          <Nav className="me-auto">
            {
              localStorage.getItem("user-info")?
              <>

              <Nav.Link href="/invoice">Invoice</Nav.Link>
              <Nav.Link href="/service"> Service</Nav.Link>
              <Nav.Link href="/customer"> Customer</Nav.Link>

              <NavDropdown title={user && user.username}>
                <NavDropdown.Item onClick={logOut}>Logout</NavDropdown.Item>
              </NavDropdown>
              </>:
              <>
              <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
              </>
            }
           
            
            
          </Nav>
        </Container>
      </Navbar>
      <br />
   
    </div>
  )
}

export default Header
