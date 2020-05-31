/* user management */

const initialState = {
	id: null,
    username: null,
	isSignedIn: false,
	locations: null
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
				locations: action.payload
			}
		case "SET_ID":
			return {
				...state,
				id: action.payload
			}
		default:
			return state
	}
};

export default userReducer;