import React, { useEffect, useState } from 'react';
import {
    Container, Card
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';
import Navigation from './Navigation';
//import firebase from '../firebase';
import SelectLocation from './SelectLocation';

function Monitoring(props) {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const [url, setUrl] = useState(null);
    const history = useHistory();
    const VIRTUAL_WIDTH = 800;
    const VIRTUAL_HEIGHT = 640;
    const scaleX = (width / VIRTUAL_WIDTH) > 1 ? 1 : (width / VIRTUAL_WIDTH);
    const scaleY = (height / VIRTUAL_HEIGHT) > 1 ? 1 : (height / VIRTUAL_HEIGHT);

    const setWindowSize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };

    useEffect(() => {
        window.addEventListener("resize", setWindowSize);
        return () => {
            window.removeEventListener("resize", setWindowSize);
        }
    });

    useEffect(() => {
        if (props.selectLocationState.selectLocation) {
            if (props.userState.location !== null && props.userState.location !== undefined) {
                let obj = props.userState.location;
                let sel = props.selectLocationState.selectLocation;
                setUrl(obj[sel]);
            }
        }
    }, [props.selectLocationState.selectLocation, props.userState.location]);

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

    // padding top for prevent overlap others content from navigation bar
    return (
        <Container>
            <Navigation />
            <Container style={{ paddingTop: "70px", paddingBottom: "70px" }}>
                <Card className="text-center">
                    <Card.Body>
                        <SelectLocation userLocation={true}/>
                        <Stage width={width} height={height} scaleX={scaleX} scaleY={scaleX}>
                            <Layer>
                                <Map x={300} y={100} width={VIRTUAL_WIDTH} height={VIRTUAL_HEIGHT} scaleX={scaleX} scaleY={scaleY} url={url} />
                            </Layer>
                        </Stage>
                        <SelectLocation />
                    </Card.Body>
                </Card>
            </Container>
        </Container>
    );
}

const Map = (props) => {
    const [image] = useImage(props.url);

    return <Image
        image={image}
        x={props.x * props.scaleX}
        y={props.y * props.scaleY}
        scalex={props.scaleX}
        scaleY={props.scaleX}
    />;
};

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

export default connect(mapStateToProps, mapDispatchToProps)(Monitoring);