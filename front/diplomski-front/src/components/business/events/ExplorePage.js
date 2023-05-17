import React, { useCallback } from 'react';
import '../../../assets/styles/business.css';
import {useEffect, useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
// import { getRole } from '../../services/utils/AuthService';
import ListedEvent from './ListedEvent';
import { getAvailableEvents } from '../../../services/api/EventApi';
import EventsList from './EventsList';

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

    return <>
            <EventsList events={events}/>
        </>
}

