import React, { useCallback } from 'react';
import '../../../assets/styles/business.css';
import {useEffect, useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
// import { getRole } from '../../services/utils/AuthService';
import ListedEvent from './ListedEvent';
import { getAvailableEvents } from '../../../services/api/EventApi';

export default function EventsList({events, type="EXPLORE"}){

    const [listedEvents, setListedEvents] = useState([]);
    const [changabledCollumnHeader, setChangabledCollumnHeader] = useState("");

    const determineChangableCollumnHeader = () => {
        if (type === "EXPLORE"){
            setChangabledCollumnHeader("Price");
        } else if ("MYEVENTS"){
            setChangabledCollumnHeader("Status");
        }
    }

    useEffect(() => {
        determineChangableCollumnHeader();

        if (!!events){
            console.log(events)
            let mappedEvents = events.map((event) => <ListedEvent event={event} type={type} key={event.id}/>)
            setListedEvents(mappedEvents);
        }
    }, [events])

    return <>
            <center><h3>Events</h3></center>
            <br/>

            <Row>
                <Col sm="2">
                    Name
                </Col>
                <Col sm="2">
                    City
                </Col>
                <Col sm="2">
                    Start date
                </Col>
                <Col sm="2">
                    Start time
                </Col>
                <Col sm="2">
                    {changabledCollumnHeader}
                </Col>
                <Col sm="2" />
            </Row>

            {listedEvents}
            {/* just gives nice space in the bottom */}
            <p className='mt-3'></p> 
        </>
}

