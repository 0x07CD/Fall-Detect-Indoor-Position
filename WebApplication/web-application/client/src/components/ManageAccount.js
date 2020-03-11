import React, { Component } from 'react';
import {
    Container
} from 'react-bootstrap';
import Navigation from './Navigation';

class ManageAccount extends Component {
    render() {
        return (
            <Container>
                <Navigation />
                <Container style={{ paddingTop: '70px' } /*for prevent overlap others content from navigation bar*/}>

                </Container>
            </Container>
        );
    }
}

export default ManageAccount;