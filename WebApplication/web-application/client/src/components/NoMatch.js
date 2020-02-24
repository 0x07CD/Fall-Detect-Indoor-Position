import React from 'react';
import {
    Container,
    Jumbotron
} from 'react-bootstrap';

function NoMatch() {
    return (
        <Container style={{ paddingTop: '70px' }}>
            <Jumbotron>
                <h1>Sorry</h1>
                <p>This page is currently under maintenance</p>
            </Jumbotron>
        </Container>
    );
}

export default NoMatch;