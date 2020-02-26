import validateInput from './validateInput';

/*
    form = {
        username: {
            value: "username value",
            required: true | false
        },
        email: {
            value: "email value",
            required: true | false
        },
        password: {
            value: "password value",
            required: true | false
        },
        confirmPassword: {
            value: "confirm password value",
            required: true | false
        }
    }
*/

function validateForm(form) {
    var result = {
        username: {
            err_msg: "",
            valid: true
        },
        email: {
            err_msg: "",
            valid: true
        },
        password: {
            err_msg: "",
            valid: true
        },
        confirmPassword: {
            err_msg: "",
            valid: true
        }
    };

    if (form.username !== undefined){
        if (form.username.required) {
            if (form.username.value.length === 0 || !form.username.value) {
                result.username = {
                    err_msg: "enter username",
                    valid: false
                };
            } else if (!validateInput("username", form.username.value)) {
                result.username = {
                    err_msg: "username must be 6-20 characters with contain alphanumeric, dot, underscore which first and last character must be an alphanumeric",
                    valid: false
                };
                /*
                props.updateErrMsg("username", "username must be 6-20 characters with contain alphanumeric, dot, underscore which first and last character must be an alphanumeric");
                props.updateValid("username", false);
                */
            } else {
                result.username = {
                    err_msg: "",
                    valid: true
                };
                // props.updateValid("username", true);
            }
        }
    }
    
    if (form.email !== undefined) {
        if (form.email.required) {
            if (form.email.value.length === 0 || !form.email.value) {
                result.email = {
                    err_msg: "enter email",
                    valid: false
                };
                /*
                props.updateErrMsg("email", "enter email");
                props.updateValid("email", false);
                */
            } else if (!validateInput("email", form.email.value)) {
                result.email = {
                    err_msg: "email is invalid",
                    valid: false
                };
                /*
                props.updateErrMsg("email", "email is invald");
                props.updateValid("email", false);
                */
            } else {
                result.email = {
                    err_msg: "",
                    valid: true
                };
                // props.updateValid("email", true);
            }
        }
    }
    
    if (form.password !== undefined) {
        if (form.password.required) {
            if (form.password.value.length === 0 || !form.password.value) {
                result.password = {
                    err_msg: "enter password",
                    valid: false
                };
                /*
                props.updateErrMsg("password", "enter password");
                props.updateValid("password", false);
                */
            } else if (!validateInput("password", form.password.value)) {
                result.password = {
                    err_msg: "password must be 6-20 characters with contain alphanumeric, dot, underscore which first character must be an alphanumeric",
                    valid: false
                };
                /*
                props.updateErrMsg("password", "password must be 6-20 characters with contain alphanumeric, dot, underscore which first character must be an alphanumeric");
                props.updateValid("password", false);
                */
            } else {
                result.password = {
                    err_msg: "",
                    valid: true
                };
                // props.updateValid("password", true);
            }
        }
    }
    
    if (form.password !== undefined && form.confirmPassword !== undefined) {
        if (form.password.required && form.confirmPassword.required) {
            if ((form.confirmPassword.value.length === 0 || !form.confirmPassword.value) && form.password.value.length > 0) {
                result.confirmPassword = {
                    err_msg: "please confirm password",
                    valid: false
                };
                /*
                props.updateErrMsg("confirmPassword", "please confirm password");
                props.updateValid("confirmPassword", false);
                */
            } else if (form.password.value !== form.confirmPassword.value) {
                result.confirmPassword = {
                    err_msg: "those passwords don't match try again",
                    valid: false
                };
                /*
                props.updateErrMsg("confirmPassword", "those passwords don't match try again");
                props.updateValid("confirmPassword", false);
                */
            } else {
                result.confirmPassword = {
                    err_msg: "",
                    valid: true
                };
                // props.updateValid("confirmPassword", true);
            }
        }
    }

    return result;
}

export default validateForm;