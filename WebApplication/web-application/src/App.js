import React from 'react';
import { Container } from 'react-bootstrap';
import Login from './components/Login';
import Register from './components/Register';

function App() {
	return (
		<Container>
			<Login />
			<Register />
		</Container>
	);
}

export default App;
