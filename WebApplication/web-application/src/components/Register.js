import React, { Component } from 'react';
import {
	Container,
	Col,
	Form,
	Button,
	ButtonToolbar,
	InputGroup,
	Card
} from 'react-bootstrap';
import { FaEye, FaEyeSlash } from "react-icons/fa";

class Register extends Component {
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
							<h5 align="center">Create account</h5>

							<Form.Row>
								{/* Name filed */}
								<Form.Group as={Col} controlId="firstName_field">
									<Form.Label>First Name</Form.Label>
									<Form.Control type="text" />
								</Form.Group>

								<Form.Group as={Col} controlId="lastName_field">
									<Form.Label>Last Name</Form.Label>
									<Form.Control type="text" />
								</Form.Group>
							</Form.Row>

							{/* Email filed */}
							<Form.Group controlId="email_reg_field">
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" />
							</Form.Group>

							<Form.Row>
								{/* Password filed */}
								<Form.Group as={Col} controlId="password_reg_field">
									<Form.Label>Password</Form.Label>
									<Form.Control type={this.state.hidePassword? "password" : "text"} />
								</Form.Group>

								{/* Confirm filed */}
								<Form.Group as={Col} controlId="confirm_reg_field">
									<Form.Label>Confirm password</Form.Label>
									<InputGroup>
									<Form.Control type={this.state.hidePassword? "password" : "text"} />
									<InputGroup.Append>
										{/* Eye icon */}
										<InputGroup.Text variant="light" onClick={this.hidePasswordHandle}>
											{
												!this.state.hidePassword?
												<FaEye /> :
												<FaEyeSlash />
											}
										</InputGroup.Text>
									</InputGroup.Append>
								</InputGroup>
								</Form.Group>
							</Form.Row>

							<ButtonToolbar className="justify-content-between">
								{/* SignIn button */}
								<Button variant="link" type="button">Sign in instead</Button>

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

export default Register;