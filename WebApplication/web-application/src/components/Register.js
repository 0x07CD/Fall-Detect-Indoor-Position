import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
	Redirect
} from 'react-router-dom';
import {
	Container,
	Col,
	Form,
	Button,
	ButtonToolbar,
	InputGroup,
	Card
} from 'react-bootstrap';
import firebase from '../firebase';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register(props) {
	const [hidePassword, setHidePassword] = useState(true);

	const firstName_value = props.registerForm.firstName.value;
	const lastName_value = props.registerForm.lastName.value;
	const username_value = props.registerForm.username.value;
	const email_value = props.registerForm.email.value;
	const password_value = props.registerForm.password.value;
	const confirmPassword_value = props.registerForm.confirmPassword.value;

	const form_data = [
		props,
		firstName_value,
		lastName_value,
		username_value,
		email_value,
		password_value,
		confirmPassword_value
	];

	const onChange = (event) => {
		event.preventDefault();
		props.updateValue(event.target.name, event.target.value);
	};

	const onSubmit = (event) => {
		event.preventDefault();

		// validateForm() return false if data invalid 
		if (!validateForm(...form_data)) {
			return;
		}

		firebase.firestore().collection("users").doc(username_value).set({
			firstName: firstName_value,
			lastName: lastName_value,
			email: email_value,
			password: password_value
		}).catch(function (error) {
			console.log(error);
		});

		firebase.auth().createUserWithEmailAndPassword(
			email_value, password_value
		).catch(function (error) {
			console.log(error.message);
		});

		props.history.push("/login");
	};

	return (
		<Container style={{ paddingTop: '70px' } /*for prevent overlap others content from navigation bar*/}>
			<Card>
				<Card.Body>
					<Form onSubmit={onSubmit}>
						<h4 align="center">Patients Surveillance System</h4>
						<h5 align="center">Create account</h5>

						<Form.Row>
							{/* Name filed */}
							<Form.Group as={Col} controlId="firstName_field">
								<Form.Label>First Name</Form.Label>
								<Form.Control type="text" name="firstName" onChange={onChange} isInvalid={!props.registerForm.firstName.valid} />
								<Form.Text className={props.registerForm.firstName.valid ? "text-muted" : "text-danger"}>
									{
										props.registerForm.firstName.valid ?
											"" : props.registerForm.firstName.errMsg
									}
								</Form.Text>
							</Form.Group>

							<Form.Group as={Col} controlId="lastName_field">
								<Form.Label>Last Name</Form.Label>
								<Form.Control type="text" name="lastName" onChange={onChange} isInvalid={!props.registerForm.lastName.valid} />
								<Form.Text className={props.registerForm.lastName.valid ? "text-muted" : "text-danger"}>
									{
										props.registerForm.lastName.valid ?
											"" : props.registerForm.lastName.errMsg
									}
								</Form.Text>
							</Form.Group>
						</Form.Row>

						{/* username filed */}
						<Form.Group controlId="username_reg_field">
							<Form.Label>Username</Form.Label>
							<Form.Control type="text" name="username" onChange={onChange} isInvalid={!props.registerForm.username.valid} />
							<Form.Text className={props.registerForm.username.valid ? "text-muted" : "text-danger"}>
								{
									props.registerForm.username.valid ?
										"" :
										props.registerForm.username.errMsg
								}
							</Form.Text>
						</Form.Group>

						{/* Email filed */}
						<Form.Group controlId="email_reg_field">
							<Form.Label>Email</Form.Label>
							<Form.Control type="text" name="email" onChange={onChange} isInvalid={!props.registerForm.email.valid} />
							<Form.Text className={props.registerForm.email.valid ? "text-muted" : "text-danger"}>
								{
									props.registerForm.email.valid ?
										"example@email.com" :
										props.registerForm.email.errMsg
								}
							</Form.Text>
						</Form.Group>

						<Form.Row>
							{/* Password filed */}
							<Form.Group as={Col} controlId="password_reg_field">
								<Form.Label>Password</Form.Label>
								<Form.Control type={hidePassword ? "password" : "text"} name="password" onChange={onChange} isInvalid={!props.registerForm.password.valid} />
								<Form.Text className={props.registerForm.password.valid ? "text-muted" : "text-danger"}>
									{
										props.registerForm.password.valid ?
											"use 6-20 characters with contain alphanumeric, dot, underscore which first and last character must be an alphanumeric" :
											props.registerForm.password.errMsg
									}
								</Form.Text>
							</Form.Group>

							{/* Confirm filed */}
							<Form.Group as={Col} controlId="confirm_reg_field">
								<Form.Label>Confirm password</Form.Label>
								<InputGroup>
									<Form.Control type={hidePassword ? "password" : "text"} name="confirmPassword" onChange={onChange} isInvalid={!props.registerForm.confirmPassword.valid} />
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
								<Form.Text className={props.registerForm.confirmPassword.valid ? "text-muted" : "text-danger"}>
									{
										props.registerForm.confirmPassword.valid ?
											"" :
											props.registerForm.confirmPassword.errMsg
									}
								</Form.Text>
							</Form.Group>
						</Form.Row>

						<ButtonToolbar className="justify-content-between">
							{/* Sign In link */}
							<Button href="/login" variant="link">Sign in instead</Button>

							{/* Submit button */}
							<Button variant="primary" type="submit">Next</Button>
						</ButtonToolbar>
					</Form>
				</Card.Body>
			</Card>
		</Container>
	);
}

function validateInput(inputType, inputData) {
	const name_pattern = /^[a-zA-Z]{1,20}$/;
	const username_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}[a-zA-Z0-9]$/;
	const email_pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
	const password_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}$/;

	switch (inputType) {
		case "name":
			return name_pattern.test(inputData);
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

function validateForm(props, firstName, lastName, username, email, password, confirmPassword) {
	let errors = true;

	// firstname field validate
	if (firstName.length === 0) {
		props.updateErrMsg("firstName", "enter first name");
		props.updateValid("firstName", false);
		errors = false;
	} else if (!validateInput("name", firstName)) {
		props.updateErrMsg("firstName", "first name must be contain only english letter");
		props.updateValid("firstName", false);
		errors = false;
	} else {
		props.updateValid("firstName", true);
	}

	// lastname field validate
	if (lastName.length === 0) {
		props.updateErrMsg("lastName", "enter last name");
		props.updateValid("lastName", false);
		errors = false;
	} else if (!validateInput("name", lastName)) {
		props.updateErrMsg("lastName", "last name must be contain only english letter");
		props.updateValid("lastName", false);
		errors = false;
	} else {
		props.updateValid("lastName", true);
	}

	// username field validate
	if (username.length === 0) {
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
	if (email.length === 0) {
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
	if (password.length === 0) {
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
	if (confirmPassword.length === 0 && password.length > 0) {
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
		registerForm: state.registerReducer
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);