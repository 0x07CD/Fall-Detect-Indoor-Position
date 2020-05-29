import React, { useState, useEffect } from 'react';
import {
    Modal
} from 'react-bootstrap';
import firebase from '../firebase';

function AlertBox() {
    [show, setShow] = useState(false);
    [message, setMessage] = useState("");

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        let db = firebase.firestore();
        let unsub = db.collection("monitoring").where("fall", "==", true).onSnapshot((querySnapshot) => {
            let patients = [];
            querySnapshot.forEach((doc) => {
                
            });
        });

        return cleanUp = () => {
            unsub();
        }
    });

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Fall Detect!!!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(AlertBox);