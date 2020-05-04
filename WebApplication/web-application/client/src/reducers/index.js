import { combineReducers } from 'redux';
import userReducer from './user';
import signInReducer from './signIn';
import createUserReducer from './createUser';
import selectLocationReducer from './selectLocation';

export default combineReducers({
	userReducer,
	signInReducer,
	createUserReducer,
	selectLocationReducer
});