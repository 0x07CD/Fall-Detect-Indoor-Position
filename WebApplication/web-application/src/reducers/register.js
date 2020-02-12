/* register form management */

const initialState = {
    // value, error message, valid form, invalid form
    email: {
        value: "",
        errMsg: "",
        valid: true
    },
    password: {
        value: "",
        errMsg: "",
        valid: true
    },
    confirmPassword: {
        value: "",
        errMsg: "",
        valid: true
    },
    firstName: {
        value: "",
        errMsg: "",
        valid: true
    },
    lastName: {
        value: "",
        errMsg: "",
        valid: true
    }
};

const registerReducer = (state = initialState, action) => {
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

export default registerReducer;