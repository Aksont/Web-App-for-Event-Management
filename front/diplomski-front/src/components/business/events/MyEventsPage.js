import React, { useCallback } from 'react';
import '../../../assets/styles/business.css';
import {useEffect, useState} from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
// import { getRole } from '../../services/utils/AuthService';
import ListedEvent from './ListedEvent';
import { getAvailableEvents } from '../../../services/api/EventApi';
import EventsList from './EventsList';
import { getUserEvents } from '../../../services/api/EventApi';
import { getLoggedUserEmail } from '../../../services/utils/AuthService';
import { FilterForm } from '../../forms/FilterForm';

export default function MyEventsPage(){

    const [events, setEvents] = useState([]);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        let _userEmail = getLoggedUserEmail();
        setUserEmail(_userEmail);
    }, [])

    useEffect(() => {
        if (!!userEmail){
            getUserEvents(userEmail).then(
                (response) => {
                    console.log(response)
                    setEvents(!!response ? response.data : []);
                }
            )
        }
    }, [userEmail])

    const resetButtonPressed = (e) => {
        e.preventDefault();

        getUserEvents(userEmail).then(
            (response) => {
                console.log(response)
                setEvents(!!response ? response.data : []);
            }
        )
      }

    if (!!userEmail){
        return <>
        <Form>
            <FilterForm setEventsFunc={setEvents} myUserEmail={userEmail} />
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
        <EventsList events={events} type="MYEVENTS"/>
    </>
    }
}

