import React, { Component } from 'react';
import {
    Navbar,
    Nav,
    NavDropdown
} from 'react-bootstrap';

class Navigation extends Component{
    render() {
        return (
            <Navbar className="justify-content-between" expand="md" fixed="top" bg="dark" variant="dark">
                <Navbar.Brand>Patients Surveillance System</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link>Home</Nav.Link>
                    <Nav.Link>Monitor</Nav.Link>
                    <Nav.Link>Configuration</Nav.Link>
                </Nav>
                <Nav className="ml-auto">
                    <NavDropdown title="User">
                        <NavDropdown.Item>Manage accont</NavDropdown.Item>
                        <NavDropdown.Item>Sign out</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar>
        );
    }; 
}

export default Navigation;
