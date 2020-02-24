import axios from 'axios';

export function createUserAction(){
    return (dispatch) => {
        axios.get("").then(() => {
            dispatch({
                type: "",
                payload: {
                    name: "",
                    value: ""
                }
            });
        });
    }
};