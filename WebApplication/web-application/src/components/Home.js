import React, { Component } from 'react';
import {
    Container
} from 'react-bootstrap';
import Navigation from './Navigation';


class Home extends Component{
    render() {
        return (
            <Container>
                <Navigation />

            </Container>
        );
    }; 
}

export default Home;