/* user management */

const initialState = {
	selectLocation: "Select location",
	locations: null
};

const SelectLocationReducer = (state = initialState, action) => {
	switch (action.type) {
		case "SET_SELECT_LOCATION":
			return {
				...state,
				selectLocation: action.payload
			};
		case "SETUP_LOCATION":
			return {
				...state,
				locations: action.payload
			};
		default:
			return state
	}
};

export default SelectLocationReducer;