import React, { useEffect } from 'react';
import {
    Container
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as serviceWorker from '../serviceWorker';
import Navigation from './Navigation';

function ManageAccount(props) {
    const history = useHistory();

    useEffect(() => {
        if (Notification.permission === "default") {
            Notification.requestPermission().then((result) => {
                if (result === "granted") {
                    if ("serviceWorker" in navigator) {
                        const applicationServerKey = serviceWorker.urlB64ToUint8Array("BOQ4-GDtCdX8OB3sb_6R3NpagwxVuUWFelVysbvunzysL_tL0L-nCIo-FRxMdLddi01RSY7TgJ9ZbkfWrKR6p7M");
                        const options = {
                            applicationServerKey,
                            userVisibleOnly: true
                        };

                        navigator.serviceWorker.ready.then((reg) => {
                            reg.pushManager.subscribe(options).then(async (subscription) => {
                                const response = await serviceWorker.saveSubscription(props.userState.id, JSON.stringify(subscription));
                                console.log(response);
                            });

                        });
                    }
                }
            });
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