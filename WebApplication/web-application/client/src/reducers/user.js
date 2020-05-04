/* user management */

const initialState = {
    username: null,
	isSignedIn: false,
	location: null
};

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case "SIGN_IN":
			return {
				...state,
				isSignedIn: true
			};
		case "SIGN_OUT":
			return {
				...state,
				isSignedIn: false
			};
		case "SET_USERNAME":
            return {
                ...state,
                username: action.payload
			}
		case "SET_LOCATION":
			return {
				...state,
				location: action.payload
			}
		default:
			return state
	}
};

export default userReducer;