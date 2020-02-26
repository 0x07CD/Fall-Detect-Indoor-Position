import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
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
import validateForm from '../function/validateForm';

function CreateUser(props) {
	const [hidePassword, setHidePassword] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const history = useHistory();

	const username_value = props.createUserForm.username.value;
	const email_value = props.createUserForm.email.value;
	const password_value = props.createUserForm.password.value;
	const confirmPassword_value = props.createUserForm.confirmPassword.value;

	const form_data = {
		username: {
			value: username_value,
			required: true
		},
		email: {
			value: email_value,
			required: true
		},
		password: {
			value: password_value,
			required: true
		},
		confirmPassword: {
			value: confirmPassword_value,
			required: true
		}
	};

	/*
	useEffect(() => {
		
	});
	*/

	const onChange = (event) => {
		event.preventDefault();
		props.updateValue(event.target.name, event.target.value);
	};

	const onSubmit = async (event) => {
		event.preventDefault();

		const result = validateForm(form_data);
		let valid = true;

		if (!result.username.valid) {
			props.updateErrMsg("username", result.username.err_msg);
			props.updateValid("username", result.username.valid);
			valid = false;
		} else {
			props.updateValid("username", result.username.valid);
		}

		if (!result.email.valid) {
			props.updateErrMsg("email", result.email.err_msg);
			props.updateValid("email", result.email.valid);
			valid = false;
		} else {
			props.updateValid("email", result.email.valid);
		}

		if (!result.password.valid) {
			props.updateErrMsg("password", result.password.err_msg);
			props.updateValid("password", result.password.valid);
			valid = false;
		} else {
			props.updateValid("password", result.password.valid);
		}

		if (!result.confirmPassword.valid) {
			props.updateErrMsg("confirmPassword", result.confirmPassword.err_msg);
			props.updateValid("confirmPassword", result.confirmPassword.valid);
			valid = false;
		} else {
			props.updateValid("confirmPassword", result.confirmPassword.valid);
		}

		if (!valid) {
			return null;
		}

		// for disable input field and animate loading
		setIsLoading(true);

		const body = {
			username: username_value,
			email: email_value,
			password: password_value
		};

		const response = await axios.post("https://us-central1-ce62-29.cloudfunctions.net/api/createUser", body).then((res) => {
			return res.data;
		}).catch((error) => {
			return {
				massage: error
			};
		});

		if (response.massage !== "successfully") {
			props.updateErrMsg("other", "create account error, please try again");
			props.updateValid("other", false);
			return null;
		}else{
			props.updateValid("other", true);
		}

		setIsLoading(false);
		history.push("sign_in");
	};

	// JSX
	return (
		<Container style={{ paddingTop: "70px", maxWidth: "600px" } /*padding for prevent overlap others content from navigation bar*/}>
			<Card>
				<Card.Body>
					<Form onSubmit={onSubmit}>
						<h4 align="center">Patients Surveillance System</h4>
						<h5 align="center">Create account</h5>

						{/* username filed */}
						<Form.Group controlId="username_field">
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
						<Form.Group controlId="email_field">
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
							<Form.Group as={Col} controlId="password_field">
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
							<Form.Group as={Col} controlId="confirm_field">
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
											<Spinner animation="border" role="status" size="sm">
												<span className="sr-only">Loading...</span>
											</Spinner> :
											"Next"
									}
								</Button>
							</Form.Group>
							<Form.Text className={props.createUserForm.other.valid ? "text-muted" : "text-danger"}>
								{
									props.createUserForm.other.valid ?
										"" :
										props.createUserForm.other.errMsg
								}
							</Form.Text>

						</ButtonToolbar>
					</Form>
				</Card.Body>
			</Card>
		</Container>
	);
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