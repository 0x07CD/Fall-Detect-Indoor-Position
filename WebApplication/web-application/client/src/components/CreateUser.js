import React, { useState, useEffect } from 'react';
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
import SelectLocation from './SelectLocation';

function CreateUser(props) {
	const [initial, setInitial] = useState(true);
	const [hideErrorSelectLocation, setHideErrorSelectLocation] = useState(true);
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

	const onChange = (event) => {
		event.preventDefault();
		props.updateValue(event.target.name, event.target.value);
	};

	const onSubmit = (event) => {
		event.preventDefault();
		props.updateValid("other", true);
		setIsLoading(true);

		const result = validateForm(form_data);

		if (!result.username.valid) {
			props.updateErrMsg("username", result.username.err_msg);
			props.updateValid("username", result.username.valid);
			setIsLoading(false);
			return;
		} else {
			props.updateValid("username", result.username.valid);
		}

		if (!result.email.valid) {
			props.updateErrMsg("email", result.email.err_msg);
			props.updateValid("email", result.email.valid);
			setIsLoading(false);
			return;
		} else {
			props.updateValid("email", result.email.valid);
		}

		if (!result.password.valid) {
			props.updateErrMsg("password", result.password.err_msg);
			props.updateValid("password", result.password.valid);
			setIsLoading(false);
			return;
		} else {
			props.updateValid("password", result.password.valid);
		}

		if (!result.confirmPassword.valid) {
			props.updateErrMsg("confirmPassword", result.confirmPassword.err_msg);
			props.updateValid("confirmPassword", result.confirmPassword.valid);
			setIsLoading(false);
			return;
		} else {
			props.updateValid("confirmPassword", result.confirmPassword.valid);
		}

		if (props.selectLocationState.selectLocation === "Select location") {
			setHideErrorSelectLocation(false);
			setIsLoading(false);
			return;
		} else {
			setHideErrorSelectLocation(true);
		}

		fetchData();
	};

	const fetchData = () => {
		const body = {
			username: username_value,
			email: email_value,
			password: password_value,
			location: props.selectLocationState.selectLocation
		};

		axios.post("https://us-central1-ce62-29.cloudfunctions.net/api/users/createUser", body).then((res) => {
			if (res.status === 200) {
				console.log(res.data);
				props.updateValid("other", true);
				setIsLoading(false);
				history.push("sign_in");
			} else {
				console.log(res.data);
				props.updateErrMsg("other", "create account error, please try again");
				props.updateValid("other", false);
				setIsLoading(false);
			}
		}).catch((e) => {
			props.updateErrMsg("other", e.response.data.message);
			props.updateValid("other", false);
			setIsLoading(false);
		});
	};

	useEffect(() => {
		if (initial) {
			axios.get("https://us-central1-ce62-29.cloudfunctions.net/api/locations").then((res) => {
				if (res.status === 200) {
					props.setupLocation(res.data.locations);
					console.log(res.data.locations);
				}
			}).catch((e) => {
				console.log(e);
			});
			setInitial(false);
		}
	}, [initial, props]);

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

						<Form.Row>
							<Form.Group as={Col} controlId="select_location_field">
								<SelectLocation userLocation={false}/>
								<Form.Text className={hideErrorSelectLocation ? "text-muted" : "text-danger"}>
									{
										hideErrorSelectLocation ?
										"" :
										"please select location to be tracked"
									}
								</Form.Text>
							</Form.Group>
						</Form.Row>

						<ButtonToolbar className="justify-content-between">
							{/* Sign In link */}
							<Button variant="link" href="/sign_in" disabled={isLoading}>Sign in instead</Button>

							<Form.Group>
								{/* Submit button */}
								<Button variant="info" type="submit" disabled={isLoading}>
									{
										isLoading ?
											<Spinner animation="border" role="status" size="sm">
												<span className="sr-only">Loading...</span>
											</Spinner> :
											"Next"
									}
								</Button>
							</Form.Group>
						</ButtonToolbar>

						<Form.Row>
							<Form.Text className={props.createUserForm.other.valid ? "text-muted" : "text-danger"}>
								{
									props.createUserForm.other.valid ?
										"" :
										props.createUserForm.other.errMsg
								}
							</Form.Text>
						</Form.Row>
					</Form>
				</Card.Body>
			</Card>
		</Container>
	);
}

const mapStateToProps = state => {
	return {
		createUserForm: state.createUserReducer,
		selectLocationState: state.selectLocationReducer
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
		},
		setSelectLocation: (value_param) => {
			return dispatch({ type: "SET_SELECT_LOCATION", payload: value_param });
		},
		setupLocation: (value_param) => {
			return dispatch({ type: "SETUP_LOCATION", payload: value_param });
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);