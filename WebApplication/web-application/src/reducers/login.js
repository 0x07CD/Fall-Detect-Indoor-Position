/* login page management */

const initialState = {
	hidePassword: true,
};

const loginReducer = (state = initialState, action) => {
	switch (action.type) {
		case "HIDE_PASS":
			return {
				hidePassword: true
			};
		case "SHOW_PASS":
			return {
				hidePassword: false
			};
		default:
			return {
				hidePassword: state.hidePassword
			};
	}
};

export default loginReducer;