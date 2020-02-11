import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
	Link,
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
	const password_pattern = /[a-z]/;

	const firstName_form = props.registerForm.firstName.value;
	const lastName_form = props.registerForm.lastName.value;
	const email_form = props.registerForm.email.value;
	const password_form = props.registerForm.password.value;
	const confirm_form = props.registerForm.confirmPassword.value;

	const onChange = (event) => {
		props.updateForm([event.target.name, event.target.value]);
	};

	const onSubmit = () => {
		// firstname field
		if (!firstName_form.match(name_pattern)){
			props.updateErrMsg(["firstName", ""]);
			return;
		}

		// lastname field
		if (props.registerForm.lastName.value){
			props.updateErrMsg(["lastName", ""]);
			return;
		}

		// email field
		if (!email_form.match(email_pattern)){
			props.updateErrMsg(["email", ""]);
			return;
		}

		// password field
		if (props.registerForm.password.value){
			props.updateErrMsg(["password", ""]);
			return;
		}

		// confirm password field
		if (props.registerForm.password.value !== props.registerForm.confirmPassword.value){
			props.updateErrMsg(["confirmPassword", "those passwords don't match try again"]);
			return;
		}

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
								<Form.Control type="text" name="firstName" onChange={onChange} />
								<Form.Text className="text-danger">
      								{props.registerForm.firstName.errMsg}
    							</Form.Text>
							</Form.Group>

							<Form.Group as={Col} controlId="lastName_field">
								<Form.Label>Last Name</Form.Label>
								<Form.Control type="text" name="lastName" onChange={onChange} />
								<Form.Text className="text-danger">
      								{props.registerForm.lastName.errMsg}
    							</Form.Text>
							</Form.Group>
						</Form.Row>

						{/* Email filed */}
						<Form.Group controlId="email_reg_field">
							<Form.Label>Email</Form.Label>
							<Form.Control type="email" />
							<Form.Text className="text-danger">
      								{props.registerForm.email.errMsg}
    							</Form.Text>
						</Form.Group>

						<Form.Row>
							{/* Password filed */}
							<Form.Group as={Col} controlId="password_reg_field">
								<Form.Label>Password</Form.Label>
								<Form.Control type={hidePassword ? "password" : "text"} />
								<Form.Text className="text-danger">
      								{props.registerForm.password.errMsg}
    							</Form.Text>
							</Form.Group>

							{/* Confirm filed */}
							<Form.Group as={Col} controlId="confirm_reg_field">
								<Form.Label>Confirm password</Form.Label>
								<InputGroup>
									<Form.Control type={hidePassword ? "password" : "text"} />
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
								<Form.Text className="text-danger">
      								{props.registerForm.confirmPassword.errMsg}
    							</Form.Text>
							</Form.Group>
						</Form.Row>

						<ButtonToolbar className="justify-content-between">
							{/* SignIn button */}
							<Link to="/login">Sign in instead</Link>

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
		updateValue: (arg) => {
			return dispatch({type: "UPDATE_VALUE", payload: {name: arg[0], value: arg[1]}})
		},
		updateErrMsg: (arg) => {
			return dispatch({type: "UPDATE_ERR_MSG", payload: {name: arg[0], value: arg[1]}})
		},
		updateValid: (arg) => {
			return dispatch({type: "UPDATE_VALID", payload: {name: arg[0], value: arg[1]}})
		},
		updateInvalid: (arg) => {
			return dispatch({type: "UPDATE_INVALID", payload: {name: arg[0], value: arg[1]}})
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);