import React, { useEffect } from 'react';
import {
    Container
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import * as serviceWorker from '../serviceWorker';
import Navigation from './Navigation';

function ManageAccount(props) {
    const history = useHistory();

    useEffect(() => {
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
    });

    useEffect(() => {
        if (!props.userState.isSignedIn) {
            console.log("username: " + props.userState.username);
            console.log("sign in: " + props.userState.isSignedIn);
            history.push("/sign_in");
        } else {
            console.log("username: " + props.userState.username);
            console.log("sign in: " + props.userState.isSignedIn);
        }
    }, [history, props.userState.username, props.userState.isSignedIn]);

    return (
        <Container>
            <Navigation />
            <Container style={{ paddingTop: '70px' } /*for prevent overlap others content from navigation bar*/}>

            </Container>
        </Container>
    );
}

const mapStateToProps = state => {
    return {
        userState: state.userReducer,
        selectLocationState: state.selectLocationReducer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => {
            return dispatch({ type: "SIGN_OUT" });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageAccount);