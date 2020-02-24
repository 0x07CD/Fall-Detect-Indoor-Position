import { combineReducers } from 'redux';
import signInReducer from './signIn';
import createUserReducer from './createUser';

export default combineReducers({
	signInReducer,
	createUserReducer
});