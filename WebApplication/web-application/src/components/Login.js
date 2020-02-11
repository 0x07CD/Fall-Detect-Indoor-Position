import React, { useState } from 'react';
// import firebase from '../firebase';
import {
	Link
} from 'react-router-dom';
import {
	Container,
	Form,
	Button,
	ButtonToolbar,
	InputGroup,
	Card
} from 'react-bootstrap';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
	const [hidePassword, setHidePassword] = useState(true);

	return (
		<Container style={{ paddingTop: '70px' } /*for prevent overlap others content from navigation bar*/}>
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
								<Form.Control type={hidePassword ? "password" : "text"} />
								<InputGroup.Append>
									{/* Eye icon */}
									<InputGroup.Text onClick={() => setHidePassword(!hidePassword)}>
										{
											!hidePassword ?
												<FaEye /> :
												<FaEyeSlash />
										}
									</InputGroup.Text>
								</InputGroup.Append>
							</InputGroup>
						</Form.Group>

						<ButtonToolbar className="justify-content-between">
							{/* SignIn button */}
							<Link to="/register">Create account</Link>

							{/* Submit button */}
							<Button variant="primary" type="submit">Next</Button>
						</ButtonToolbar>
					</Form>
				</Card.Body>
			</Card>
		</Container>
	);
}

export default Login;