import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import {
	Card,
	Form,
	Button,
	Spinner,
	Container,
	InputGroup,
	ButtonToolbar
} from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import firebase from '../firebase';
import validateForm from '../function/validateForm';

function SignIn(props) {
	const [hidePassword, setHidePassword] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	//const [loading, setLoading] = useState(false);
	const history = useHistory();

	const email_value = props.signInForm.email.value;
	const password_value = props.signInForm.password.value;

	const form_data = {
		email: {
			value: email_value,
			required: true
		},
		password: {
			value: password_value,
			required: true
		}
	}

	const onChange = (event) => {
		event.preventDefault();
		props.updateValue(event.target.name, event.target.value);
	};

	const onSubmit = (event) => {
		event.preventDefault();
		props.updateValid("other", true);
		setIsLoading(true);

		const result = validateForm(form_data);

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

		fetctData();
	}

	// sign in
	const fetctData = () => {
		firebase.auth().signInWithEmailAndPassword(email_value, password_value).then((userCredential) => {
			userCredential.user.getIdToken(true).then((token) => {
				axios.post("https://us-central1-ce62-29.cloudfunctions.net/api/users/signIn", { token: token }).then((res) => {
					if (res.status === 200) {
						props.updateValid("other", true);
						props.signIn();
						props.setUsername(res.data.username);
						props.setLocation(res.data.locations);
						setIsLoading(false);
						history.push("monitoring");
					} else {
						console.log(res.data);
						props.updateErrMsg("other", "error, please try again");
						props.updateValid("other", false);
						setIsLoading(false);
					}
				}).catch((e) => {
					// axios response
					props.updateErrMsg("other", e.response.data.message);
					props.updateValid("other", false);
					setIsLoading(false);
				});
			}).catch((e) => {
				props.updateErrMsg("other", e.message);
				props.updateValid("other", false);
				setIsLoading(false);
			});
		}).catch((e) => {
			props.updateErrMsg("other", e.message);
			props.updateValid("other", false);
			setIsLoading(false);
		});
	};

	return (
		<Container style={{ paddingTop: "70px", maxWidth: "600px" } /*padding for prevent overlap others content from navigation bar*/}>
			<Card>
				<Card.Body>
					<Form onSubmit={onSubmit}>
						<h4 align="center">Patients Surveillance System</h4>
						<h5 align="center">Sign in</h5>

						{/* Username filed */}
						<Form.Group controlId="email_field">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="text"
								name="email"
								onChange={onChange}
								disabled={isLoading}
								isInvalid={!props.signInForm.email.valid}
							/>
							<Form.Text className={props.signInForm.email.valid ? "text-muted" : "text-danger"}>
								{
									props.signInForm.email.valid ?
										"" :
										props.signInForm.email.errMsg
								}
							</Form.Text>
						</Form.Group>

						{/* Password field */}
						<Form.Group controlId="password_field">
							<Form.Label>Password</Form.Label>
							<InputGroup>
								<Form.Control
									type={hidePassword ? "password" : "text"}
									name="password"
									onChange={onChange}
									disabled={isLoading}
									isInvalid={!props.signInForm.password.valid}
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
							<Form.Text className={props.signInForm.password.valid ? "text-muted" : "text-danger"}>
								{
									props.signInForm.password.valid ?
										"" :
										props.signInForm.password.errMsg
								}
							</Form.Text>
						</Form.Group>

						<ButtonToolbar className="justify-content-between">
							{/* SignIn button */}
							<Button variant="link " href="/create_user" disabled={isLoading}>Create account</Button>

							{/* Submit button */}
							<Form.Group>
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
							<Form.Text className={props.signInForm.other.valid ? "text-muted" : "text-danger"}>
								{
									props.signInForm.other.valid ?
										"" :
										props.signInForm.other.errMsg
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
		userState: state.userReducer,
		signInForm: state.signInReducer
	};
};

const mapDispatchToProps = dispatch => {
	return {
		signIn: () => {
			return dispatch({ type: "SIGN_IN" });
		},
		setUsername: (value_param) => {
			return dispatch({ type: "SET_USERNAME", payload: value_param });
		},
		setLocation: (value_param) => {
			return dispatch({ type: "SET_LOCATION", payload: value_param });
		},
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);