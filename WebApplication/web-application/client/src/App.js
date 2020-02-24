import React from 'react';
import { Container } from 'react-bootstrap';
import {
	Route,
	Switch,
	useLocation
} from 'react-router-dom';
import SignIn from './components/SignIn';
import NoMatch from './components/NoMatch';
import CreateUser from './components/CreateUser';
import Navigation from './components/Navigation';
import Monitoring from './components/Monitoring';
import Configuration from './components/Configuration';
import ManageAccount from './components/ManageAccount';

function App() {
	let location = useLocation();
	let correct_path_include_navigation = /^\/(manage_account|configuration|monitoring)?$/;
	// let correct_path_exclude_navigation = /^\/(create_user|sign_in)/;
	return (
		<Container>
			{
				correct_path_include_navigation.test(location.pathname) ?
				<Navigation /> : null
			}
			<Switch>
				<Route path="/manage_account">
					<ManageAccount />
				</Route>
				<Route path="/configuration">
					<Configuration />
				</Route>
				<Route path="/monitoring">
					<Monitoring />
				</Route>
				<Route path="/create_user">
					<CreateUser />
				</Route>
				<Route path="/sign_in">
					<SignIn />
				</Route>
				<Route exact path="/">
					<Monitoring />
				</Route>
				<Route path="*">
					<NoMatch />
				</Route>
			</Switch>
		</Container>
	);
}

export default App;
