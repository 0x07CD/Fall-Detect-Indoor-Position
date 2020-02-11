import React from 'react';
import { Container } from 'react-bootstrap';
import {
	Route,
	Switch
} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Navigation from './components/Navigation';
import Monitoring from './components/Monitoring';
import Configuration from './components/Configuration';
import ManageAccount from './components/ManageAccount';

function App() {
	return (
		<Container>
			<Navigation />
			<Switch>
				<Route path="/manage_account" component={ManageAccount} />
				<Route path="/configuration" component={Configuration} />
				<Route path="/monitoring" component={Monitoring} />
				<Route path="/register" component={Register} />
				<Route path="/login" component={Login} />
				<Route path="/" component={Monitoring} />
			</Switch>
		</Container>
	);
}

export default App;
