import React, { useState } from 'react';
import {
	Container,
	Form,
	Button,
	ButtonToolbar,
	InputGroup,
	Card
} from 'react-bootstrap';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function SignIn() {
	const [hidePassword, setHidePassword] = useState(true);

	return (
		<Container style={{ paddingTop: '70px', maxWidth: '600px' } /*padding for prevent overlap others content from navigation bar*/}>
			<Card>
				<Card.Body>
					<Form>
						<h4 align="center">Patients Surveillance System</h4>
						<h5 align="center">Sign in</h5>

						{/* Username filed */}
						<Form.Group controlId="email_field">
							<Form.Label>Email</Form.Label>
							<Form.Control type="text" />
						</Form.Group>

						{/* Password field */}
						<Form.Group controlId="password_field">
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
							<Button variant="link "href="/create_user">Create account</Button>

							{/* Submit button */}
							<Button variant="primary" type="submit">Next</Button>
						</ButtonToolbar>
					</Form>
				</Card.Body>
			</Card>
		</Container>
	);
}

export default SignIn;