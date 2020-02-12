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

	const name_pattern = /^[a-zA-Z]+$/;
	const email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	const password_pattern = /^[A-Za-z]\w{6,20}$/;

	const firstName_form = props.registerForm.firstName.value;
	const lastName_form = props.registerForm.lastName.value;
	const email_form = props.registerForm.email.value;
	const password_form = props.registerForm.password.value;
	const confirmPassword_form = props.registerForm.confirmPassword.value;

	const onChange = (event) => {
		props.updateValue(event.target.name, event.target.value);
	};

	const onSubmit = () => {
		// firstname field validate
		if (firstName_form.length === 0) {
			props.updateErrMsg("firstName", "enter first name");
			props.updateValid("firstName", false);
		} else if (!firstName_form.match(name_pattern)) {
			props.updateErrMsg("firstName", "first name must be contain only english letter");
			props.updateValid("firstName", false);
		} else {
			props.updateValid("firstName", true);
		}

		// lastname field validate
		if (lastName_form.length === 0) {
			props.updateErrMsg("lastName", "enter last name");
			props.updateValid("lastName", false);
		} else if (!lastName_form.match(name_pattern)) {
			props.updateErrMsg("lastName", "last name must be contain only english letter");
			props.updateValid("lastName", false);
		} else {
			props.updateValid("lastName", true);
		}

		// email field validate
		if (email_form.length === 0) {
			props.updateErrMsg("email", "enter email");
			props.updateValid("email", false);
		} else if (!email_form.match(email_pattern)) {
			props.updateErrMsg("email", "email is invald");
			props.updateValid("email", false);
		} else {
			props.updateValid("email", true);
		}

		// password field validate
		if (password_form.length === 0) {
			props.updateErrMsg("password", "enter password");
			props.updateValid("password", false);
		} else if (!password_form.match(password_pattern)) {
			props.updateErrMsg("password", "password must be 6-20 characters and contain a-z, A-Z, 0-9 and first character must be a letter");
			props.updateValid("password", false);
		} else {
			props.updateValid("password", true);
		}

		// confirm password field validate
		if (confirmPassword_form.length === 0) {
			props.updateErrMsg("confirmPassword", "please confirm password");
			props.updateValid("confirmPassword", false);
		} else if (password_form !== confirmPassword_form) {
			props.updateErrMsg("confirmPassword", "those passwords don't match try again");
			props.updateValid("confirmPassword", false);
		} else {
			props.updateValid("confirmPassword", true);
		}
		/*
		firebase.firestore().collection("users").add({
			firstName: props.registerForm.firstName.value,
			lastName: props.registerForm.lastName.value,
			email: props.registerForm.email.value,
			password: props.registerForm.password.value
		}).catch(function(error){
			console.log(error);
		});

		firebase.auth().createUserWithEmailAndPassword(props.registerForm.email, props.registerForm.password).catch(function(error){
			console.log(error.message);
		});

		return <Redirect to="/login" />
		*/

		console.log("submit success");
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

						{/* Email filed */}
						<Form.Group controlId="email_reg_field">
							<Form.Label>Email</Form.Label>
							<Form.Control type="text" name="email" isInvalid={!props.registerForm.email.valid} />
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
								<Form.Control type={hidePassword ? "password" : "text"} name="password" isInvalid={!props.registerForm.password.valid} />
								<Form.Text className={props.registerForm.password.valid ? "text-muted" : "text-danger"}>
									{
										props.registerForm.password.valid ?
											"use 6-20 characters and contain a-z, A-Z, 0-9 and first character must be a letter" :
											props.registerForm.password.errMsg
									}
								</Form.Text>
							</Form.Group>

							{/* Confirm filed */}
							<Form.Group as={Col} controlId="confirm_reg_field">
								<Form.Label>Confirm password</Form.Label>
								<InputGroup>
									<Form.Control type={hidePassword ? "password" : "text"} name="confirmPassword" isInvalid={!props.registerForm.confirmPassword.valid} />
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