import axios from 'axios';

export function registerAction(){
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