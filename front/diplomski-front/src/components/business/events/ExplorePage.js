import React, { useCallback } from 'react';
import '../../../assets/styles/business.css';
import {useEffect, useState} from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
// import { getRole } from '../../services/utils/AuthService';
import ListedEvent from './ListedEvent';
import { getAvailableEvents } from '../../../services/api/EventApi';
import EventsList from './EventsList';
import { FilterForm } from '../../forms/FilterForm';

export default function ExplorePage(){

    const [events, setEvents] = useState([]);

    useEffect(() => {
        getAvailableEvents().then(
            (response) => {
                console.log(response)
                setEvents(!!response ? response.data : []);
            }
        )
    }, [])

    const resetButtonPressed = (e) => {
        e.preventDefault();
        getAvailableEvents().then(
            (response) => {
                console.log(response)
                setEvents(!!response ? response.data : []);
            }
        )
      }

    return <>
            <FilterForm setEventsFunc={setEvents}/>
            <Form>
                <Row className='mt-2'>
                    <Col sm={4}/>
                    <Col sm={4} align='center'>
                        <Button className='formButton' onClick={resetButtonPressed}>
                            Reset
                        </Button>
                    </Col>
                    <Col sm={4}/>
                </Row> 
            </Form>
            <EventsList events={events}/>
        </>
}

