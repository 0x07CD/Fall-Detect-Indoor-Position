/* sign in page management */

const initialState = {
	email: {
		value: "",          // data in each form
		errMsg: "",         // error message display when data is invalid
		valid: true         // use to trigger animation validate form, true value are not animate
	},
	password: {
		value: "",
		errMsg: "",
		valid: true
	},
	other: {
		value: "",
		errMsg: "",
		valid: true
	}
};

const signInReducer = (state = initialState, action) => {
	/* data structure
    action = {
        type: "UPDATE_VALUE" or "UPDATE_ERR_MSG" or "UPDATE_VALID",
        payload: {
            name: "key of the state to be update",
            value: "new value"
        }
    }
    */
	switch (action.type) {
		case "UPDATE_VALUE":
			const value_temp = { ...state[action.payload.name] }
			return {
				...state,
				[action.payload.name]: {
					...value_temp,
					value: action.payload.value
				}
			};
		case "UPDATE_ERR_MSG":
			const errMsg_temp = { ...state[action.payload.name] }
			return {
				...state,
				[action.payload.name]: {
					...errMsg_temp,
					errMsg: action.payload.value
				}
			}
		case "UPDATE_VALID":
			const valid_temp = { ...state[action.payload.name] }
			return {
				...state,
				[action.payload.name]: {
					...valid_temp,
					valid: action.payload.value
				}
			}
		default:
			return state
	}
};

export default signInReducer;