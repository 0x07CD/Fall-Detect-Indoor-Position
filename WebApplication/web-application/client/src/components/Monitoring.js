import React, { useEffect, useRef } from 'react';
import {
    Container
} from 'react-bootstrap';
import Navigation from './Navigation';
import firebase from '../firebase';

function Monitoring() {
    const img = new Image();
    const canvasRef = useRef();

    //const storage = firebase.storage();
    //const map = storage.ref("pictures/map/example/1.jpg").getDownloadURL();
    //console.log(map);
    img.src = "https://firebasestorage.googleapis.com/v0/b/ce62-29.appspot.com/o/pictures%2Fmap%2Fexample%2F1.jpg?alt=media&token=b88f6979-658e-4368-9825-e938f4027db3";
    img.alt = "Internet browser does not support canvas"

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        }
    });

    // padding top for prevent overlap others content from navigation bar
    return (
        <Container>
            <Navigation />
            <Container className="text-center" style={{ paddingTop: "70px", paddingBottom: "70px" }}>
                <canvas ref={canvasRef} width={600} height={600} />
            </Container>
        </Container>
    );
}

export default Monitoring;