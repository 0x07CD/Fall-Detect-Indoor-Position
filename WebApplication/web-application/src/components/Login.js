import React, { Component } from 'react';
// import firebase from '../firebase';
import {
	Container,
	Form,
	Button,
	ButtonToolbar,
	InputGroup,
	Card
} from 'react-bootstrap';
import { FaEye, FaEyeSlash } from "react-icons/fa";

class Login extends Component {
	state = {
		hidePassword: true
	};

	hidePasswordHandle = () => {
		this.setState({
			hidePassword: !this.state.hidePassword
		});
	};
	render() {
		return (
			<Container className="mt-5">
				<Card>
					<Card.Body>
						<Form>
							<h4 align="center">Patients Surveillance System</h4>
							<h5 align="center">Sign in</h5>

							{/* Email filed */}
							<Form.Group controlId="email_login_field">
								<Form.Label>Email address</Form.Label>
								<Form.Control type="email" />
							</Form.Group>

							{/* Password field */}
							<Form.Group controlId="password_login_field">
								<Form.Label>Password</Form.Label>
								<InputGroup>
									<Form.Control type={this.state.hidePassword? "password" : "text"} />
									<InputGroup.Append>
										{/* Eye icon */}
										<InputGroup.Text onClick={this.hidePasswordHandle}>
											{
												!this.state.hidePassword?
												<FaEye /> :
												<FaEyeSlash />
											}
										</InputGroup.Text>
									</InputGroup.Append>
								</InputGroup>
							</Form.Group>

							<ButtonToolbar className="justify-content-between">
								{/* SignIn button */}
								<Button variant="link" type="button">Create account</Button>

								{/* Submit button */}
								<Button variant="primary" type="submit">Next</Button>
							</ButtonToolbar>
						</Form>
					</Card.Body>
				</Card>
			</Container>
		);
	};
}

export default Login;