import React from 'react';
import {
    Nav,
    Navbar,
    NavDropdown
} from 'react-bootstrap';
import {
    NavLink
} from 'react-router-dom';

function Navigation(props) {
    return (
        <Navbar expand="md" fixed="top" bg="dark" variant="dark">
            <NavLink className="navbar-brand" to="/">Patients Surveillance System</NavLink>
            <Navbar.Toggle aria-controls="collapse-navbar-nav" />
            <Navbar.Collapse id="collapse-navbar-nav">
                <Nav className="mr-auto">
                    <NavLink className="nav-link" to="/monitoring">
                        Monitoring
                    </NavLink>
                    <NavLink className="nav-link" to="/configuration">
                        Configuration
                    </NavLink>
                </Nav>
                <Nav className="ml-auto">
                    <NavDropdown title="User" drop="left">
                        <NavLink className="dropdown-item bg-white text-dark" to="/manage_account">
                            Manage account
                        </NavLink>
                        <NavDropdown.Item>Sign out</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Navigation;