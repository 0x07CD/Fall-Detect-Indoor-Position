import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {
	Col,
	Card,
	Form,
	Button,
	Spinner,
	Container,
	InputGroup,
	ButtonToolbar
} from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function CreateUser(props) {
	const [hidePassword, setHidePassword] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const history = useHistory();

	const username_value = props.createUserForm.username.value;
	const email_value = props.createUserForm.email.value;
	const password_value = props.createUserForm.password.value;
	const confirmPassword_value = props.createUserForm.confirmPassword.value;

	const form_data = [
		props,
		username_value,
		email_value,
		password_value,
		confirmPassword_value
	];

	useEffect(() => {
		
	});

	const onChange = (event) => {
		event.preventDefault();
		props.updateValue(event.target.name, event.target.value);
	};

	const onSubmit = (event) => {
		event.preventDefault();

		// validateForm() return false if data invalid 
		if (!validateForm(...form_data)) {
			return null;
		}

		// for disable input field and animate loading
		setIsLoading(true);

		const body = {
			username: username_value,
			email: email_value,
			password: password_value
		};

		axios.post("https://us-central1-ce62-29.cloudfunctions.net/createUser", body).then((res) => {
			console.log(res.data);
		});

		setIsLoading(false);
		history.push("sign_in");
	};

	// JSX
	return (
		<Container style={{ paddingTop: '70px', maxWidth: '600px' } /*padding for prevent overlap others content from navigation bar*/}>
			<Card>
				<Card.Body>
					<Form onSubmit={onSubmit}>
						<h4 align="center">Patients Surveillance System</h4>
						<h5 align="center">Create account</h5>

						{/* username filed */}
						<Form.Group controlId="username_reg_field">
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								name="username"
								onChange={onChange}
								disabled={isLoading}
								isInvalid={!props.createUserForm.username.valid}
							/>
							<Form.Text className={props.createUserForm.username.valid ? "text-muted" : "text-danger"}>
								{
									props.createUserForm.username.valid ?
										"" :
										props.createUserForm.username.errMsg
								}
							</Form.Text>
						</Form.Group>

						{/* Email filed */}
						<Form.Group controlId="email_reg_field">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="text"
								name="email"
								onChange={onChange}
								disabled={isLoading}
								isInvalid={!props.createUserForm.email.valid}
							/>
							<Form.Text className={props.createUserForm.email.valid ? "text-muted" : "text-danger"}>
								{
									props.createUserForm.email.valid ?
										"" :
										props.createUserForm.email.errMsg
								}
							</Form.Text>
						</Form.Group>

						<Form.Row>
							{/* Password filed */}
							<Form.Group as={Col} controlId="password_reg_field">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type={hidePassword ? "password" : "text"}
									name="password"
									onChange={onChange}
									disabled={isLoading}
									isInvalid={!props.createUserForm.password.valid}
								/>
								<Form.Text className={props.createUserForm.password.valid ? "text-muted" : "text-danger"}>
									{
										props.createUserForm.password.valid ?
											"" :
											props.createUserForm.password.errMsg
									}
								</Form.Text>
							</Form.Group>

							{/* Confirm filed */}
							<Form.Group as={Col} controlId="confirm_reg_field">
								<Form.Label>Confirm password</Form.Label>
								<InputGroup>
									<Form.Control
										type={hidePassword ? "password" : "text"}
										name="confirmPassword"
										onChange={onChange}
										disabled={isLoading}
										isInvalid={!props.createUserForm.confirmPassword.valid}
									/>
									<InputGroup.Append>
										{/* Eye icon */}
										<InputGroup.Text variant="light" onClick={() => setHidePassword(!hidePassword)}>
											{
												!hidePassword ?
													<FaEye /> :
													<FaEyeSlash />
											}
										</InputGroup.Text>
									</InputGroup.Append>
								</InputGroup>
								<Form.Text className={props.createUserForm.confirmPassword.valid ? "text-muted" : "text-danger"}>
									{
										props.createUserForm.confirmPassword.valid ?
											"" :
											props.createUserForm.confirmPassword.errMsg
									}
								</Form.Text>
							</Form.Group>
						</Form.Row>

						<ButtonToolbar className="justify-content-between">
							{/* Sign In link */}
							<Button variant="link" href="/sign_in" disabled={isLoading}>Sign in instead</Button>

							<Form.Group>
								{/* Submit button */}
								<Button variant="primary" type="submit" disabled={isLoading}>
									{
										isLoading ?
											<Spinner animation="border" role="status">
												<span className="sr-only">Loading...</span>
											</Spinner> :
											"Next"
									}
								</Button>
							</Form.Group>

						</ButtonToolbar>
					</Form>
				</Card.Body>
			</Card>
		</Container>
	);
}

function validateInput(inputType, inputData) {
	const username_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}[a-zA-Z0-9]$/;
	const email_pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
	const password_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}$/;

	switch (inputType) {
		case "username":
			return username_pattern.test(inputData);
		case "email":
			return email_pattern.test(inputData);
		case "password":
			return password_pattern.test(inputData);
		default:
			console.log("input type don't exist...");
			return false;
	}
}

function validateForm(props, username, email, password, confirmPassword) {
	let errors = true;

	// username field validate
	if (username.length === 0 || !username) {
		props.updateErrMsg("username", "enter username");
		props.updateValid("username", false);
		errors = false;
	} else if (!validateInput("username", username)) {
		props.updateErrMsg("username", "username must be 6-20 characters with contain alphanumeric, dot, underscore which first and last character must be an alphanumeric");
		props.updateValid("username", false);
		errors = false;
	} else {
		props.updateValid("username", true);
	}

	// email field validate
	if (email.length === 0 || !email) {
		props.updateErrMsg("email", "enter email");
		props.updateValid("email", false);
		errors = false;
	} else if (!validateInput("email", email)) {
		props.updateErrMsg("email", "email is invald");
		props.updateValid("email", false);
		errors = false;
	} else {
		props.updateValid("email", true);
	}

	// password field validate
	if (password.length === 0 || !password) {
		props.updateErrMsg("password", "enter password");
		props.updateValid("password", false);
		errors = false;
	} else if (!validateInput("password", password)) {
		props.updateErrMsg("password", "password must be 6-20 characters with contain alphanumeric, dot, underscore which first character must be an alphanumeric");
		props.updateValid("password", false);
		errors = false;
	} else {
		props.updateValid("password", true);
	}

	// confirm password field validate
	if ((confirmPassword.length === 0 || !confirmPassword) && password.length > 0) {
		props.updateErrMsg("confirmPassword", "please confirm password");
		props.updateValid("confirmPassword", false);
		errors = false;
	} else if (password !== confirmPassword) {
		props.updateErrMsg("confirmPassword", "those passwords don't match try again");
		props.updateValid("confirmPassword", false);
		errors = false;
	} else {
		props.updateValid("confirmPassword", true);
	}

	return errors;
}

const mapStateToProps = state => {
	return {
		createUserForm: state.createUserReducer
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateValue: (name_param, value_param) => {
			return dispatch({ type: "UPDATE_VALUE", payload: { name: name_param, value: value_param } })
		},
		updateErrMsg: (name_param, error_param) => {
			return dispatch({ type: "UPDATE_ERR_MSG", payload: { name: name_param, value: error_param } })
		},
		updateValid: (name_param, valid_param) => {
			return dispatch({ type: "UPDATE_VALID", payload: { name: name_param, value: valid_param } })
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);