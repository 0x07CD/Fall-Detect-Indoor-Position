import { combineReducers } from 'redux';
import loginReducer from './login';
import registerReducer from './register';

export default combineReducers({
	loginReducer,
	registerReducer
});