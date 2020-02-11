/* register form management */

const initialState = {
    // value, error message, valid form, invalid form
    email: {
        value: "",
        errMsg: "",
        valid: false,
        invalid: false
    },
    password: {
        value: "",
        errMsg: "",
        valid: false,
        invalid: false
    },
    confirmPassword: {
        value: "",
        errMsg: "",
        valid: false,
        invalid: false
    },
    firstName: {
        value: "",
        errMsg: "",
        valid: false,
        invalid: false
    },
    lastName: {
        value: "",
        errMsg: "",
        valid: false,
        invalid: false
    }
};

const registerReducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_VALUE":
            return {
                ...state,
                [action.payload.name]: {
                    ...state.action.payload.name,
                    value: action.payload.value
                }
            };
        case "UPDATE_ERR_MSG":
            return {
                ...state,
                [action.payload.name]: {
                    ...state.action.payload.name,
                    errMsg: action.payload.value
                }
            }
        case "UPDATE_VALID":
            return {
                ...state,
                [action.payload.name]: {
                    ...state.action.payload.name,
                    valid: action.payload.value
                }
            };
        case "UPDATE_INVALID":
            return {
                ...state,
                [action.payload.name]: {
                    ...state.action.payload.name,
                    invalid: action.payload.value
                }
            };
        default:
            return initialState
    }
};

export default registerReducer;