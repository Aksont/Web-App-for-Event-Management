import React, { useCallback } from 'react';
import '../../../assets/styles/business.css';
import {useEffect, useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
// import { getRole } from '../../services/utils/AuthService';
import ListedEvent from './ListedEvent';
import { getAvailableEvents } from '../../../services/api/EventApi';
import EventsList from './EventsList';
import { getUserEvents } from '../../../services/api/EventApi';
import { getLoggedUserEmail } from '../../../services/utils/AuthService';

export default function MyEventsPage(){

    const [events, setEvents] = useState([]);

    useEffect(() => {
        let userEmail = getLoggedUserEmail();

        getUserEvents(userEmail).then(
            (response) => {
                console.log(response)
                setEvents(!!response ? response.data : []);
            }
        )
    }, [])

    return <>
            <EventsList events={events} type="MYEVENTS"/>
        </>
}

