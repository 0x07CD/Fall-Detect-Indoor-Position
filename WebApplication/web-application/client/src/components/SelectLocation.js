import React, { useState, useEffect } from 'react';
import {
    DropdownButton, Dropdown
} from 'react-bootstrap';
import { connect } from 'react-redux';

function SelectLocation(props) {
    const [select, setSelect] = useState(props.selectLocationState.selectLocation);
    const [location, setLocation] = useState(null);

    const handleSelect = (eventKey) => {
        props.setSelectLocation(eventKey);
    };

    useEffect(() => {
        setSelect(props.selectLocationState.selectLocation);

    }, [props.selectLocationState.selectLocation]);

    useEffect(() => {
        if (props.userLocation) {
            setLocation(props.userState.location);
        } else {
            setLocation(props.selectLocationState.location);
        }
    }, [props.userLocation, props.userState.location, props.selectLocationState.location]);

    return (
        <DropdownButton id="select_location_btn" variant="outline-primary" title={select}>
            {
                location ?
                    location.map((locationName, index) =>
                        <Dropdown.Item key={index} eventKey={locationName} onSelect={handleSelect}>
                            {locationName}
                        </Dropdown.Item>
                    ) : null
            }
        </DropdownButton>
    );
};

const mapStateToProps = state => {
    return {
        userState: state.userReducer,
        selectLocationState: state.selectLocationReducer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setSelectLocation: (value_param) => {
            return dispatch({ type: "SET_SELECT_LOCATION", payload: value_param });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectLocation);