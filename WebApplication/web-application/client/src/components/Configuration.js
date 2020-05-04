import React from 'react';
import {
    Button,
    Container
} from 'react-bootstrap';
import Navigation from './Navigation';
// import firebase from '../firebase';

function Configuration() {
    /* const filters = [{
        services: ["fa6d99a5-1b0d-417b-8c96-25de8bfc4435"]
    }]; */
    
    const handleClick = () => {
        
    }

    return (
        <Container>
            <Navigation />
            <Container style={{ paddingTop: '70px' } /*for prevent overlap others content from navigation bar*/}>
                <Button onClick={handleClick}>Connect</Button>
            </Container>
        </Container>
    );
}


export default Configuration;