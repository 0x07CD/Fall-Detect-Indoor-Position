import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import configureStore from './configureStore';
import * as serviceWorker from './serviceWorker';

const { store, persistor } = configureStore();

const MyApp = () => (
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<Router>
				<App />
			</Router>
		</PersistGate>
	</Provider>
)

ReactDOM.render(<MyApp />, document.getElementById('root'));

serviceWorker.register();
