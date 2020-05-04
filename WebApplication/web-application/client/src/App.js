import React from 'react';
import {
	Route,
	Switch
	// useLocation
} from 'react-router-dom';
import SignIn from './components/SignIn';
import NoMatch from './components/NoMatch';
import CreateUser from './components/CreateUser';
import Monitoring from './components/Monitoring';
import Configuration from './components/Configuration';
import ManageAccount from './components/ManageAccount';

function App() {
	// let location = useLocation();
	// let correct_path_include_navigation = /^\/(manage_account|configuration|monitoring)?$/;
	// let correct_path_exclude_navigation = /^\/(create_user|sign_in)/;
	return (
		<Switch>
			<Route exact path="/manage_account">
				<ManageAccount />
			</Route>
			<Route exact path="/configuration">
				<Configuration />
			</Route>
			<Route exact path="/monitoring">
				<Monitoring />
			</Route>
			<Route exact path="/create_user">
				<CreateUser />
			</Route>
			<Route exact path="/sign_in">
				<SignIn />
			</Route>
			<Route exact path="/">
				<Monitoring />
			</Route>
			<Route path="*">
				<NoMatch />
			</Route>
		</Switch>
	);
}

export default App;
