import React, { useState, useEffect } from 'react';
import {
    DropdownButton, Dropdown
} from 'react-bootstrap';
import { connect } from 'react-redux';

function SelectLocation(props) {
    const [select, setSelect] = useState(props.selectLocationState.selectLocation);
    const [locations, setLocations] = useState(null);

    const handleSelect = (eventKey) => {
        props.setSelectLocation(eventKey);
    };

    useEffect(() => {
        setSelect(props.selectLocationState.selectLocation);

    }, [props.selectLocationState.selectLocation]);

    useEffect(() => {
        if (props.userLocation) {
            setLocations(props.userState.locations);
        } else {
            setLocations(props.selectLocationState.locations);
        }
    }, [props.userLocation, props.userState.locations, props.selectLocationState.locations]);

    return (
        <DropdownButton id="select_location_btn" variant="outline-info" title={select}>
            {
                locations ?
                    locations.map((locationName, index) =>
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