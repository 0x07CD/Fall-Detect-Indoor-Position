import React from 'react';
import {
    Nav,
    Navbar,
    NavDropdown
} from 'react-bootstrap';
import {
    NavLink
} from 'react-router-dom';
import { connect } from 'react-redux';

function Navigation(props) {
    const handleClick = (event) => {
        event.preventDefault();
        props.setUsername(null);
		props.setLocation(null);
        props.signOut();
    };

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
                        <NavDropdown.Item onClick={handleClick}>Sign out</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

const mapStateToProps = state => {
	return {
		userState: state.userReducer
	};
};

const mapDispatchToProps = dispatch => {
	return {
        signOut: () => {
			return dispatch({ type: "SIGN_OUT" });
		},
		setUsername: (value_param) => {
			return dispatch({ type: "SET_USERNAME", payload: value_param });
		},
		setLocation: (value_param) => {
			return dispatch({ type: "SET_LOCATION", payload: value_param });
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);