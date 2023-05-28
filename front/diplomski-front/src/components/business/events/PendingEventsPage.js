import React, { useCallback } from 'react';
import '../../../assets/styles/business.css';
import {useEffect, useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
// import { getRole } from '../../services/utils/AuthService';
import ListedEvent from './ListedEvent';
import { getPendingEvents, putApproveRequest, putDenyRequest } from '../../../services/api/EventApi';
import EventsList from './EventsList';
import PendingEvent from './PendingEvent';
import { getUserType } from '../../../services/utils/AuthService';

export default function PendingEventsPage(){

    const [events, setEvents] = useState([]);
    const [listedEvents, setListedEvents] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        let role = getUserType();
        
        if (role !== "ADMIN"){
            navigate("/unavailable")
        }
    }, [navigate])

    useEffect(() => {
        getPendingEvents().then(
            (response) => {
                console.log(response)
                setEvents(!!response ? response.data : []);
            }
        )
    }, [])

    const approveButtonPressed = useCallback(
        (eventId) => {
            putApproveRequest(eventId).then(
                (response) => {
                    console.log(response);
                    let index = -1;
                    let i;
                    for (i in events)
                        if (events[i].id === eventId)
                            index = i;

                    if (index > -1) {
                        let newEvents = JSON.parse(JSON.stringify(events)); // deep copy array
                        newEvents.splice(index, 1); // 2nd parameter means remove one item only
                        setEvents(newEvents);
                    }

                    alert("Event was successfully approved.")
                }, (error) => {
                  console.log(error);
                }
            );
        }, [events]
    )

    const denyButtonPressed = useCallback(
        (eventId) => {
            putDenyRequest(eventId).then(
                (response) => {
                    console.log(response);
                    let index = -1;
                    let i;
                    for (i in events)
                        if (events[i].id === eventId)
                            index = i;

                    if (index > -1) {
                        let newEvents = JSON.parse(JSON.stringify(events)); // deep copy array
                        newEvents.splice(index, 1); // 2nd parameter means remove one item only
                        setEvents(newEvents);
                    }

                    alert("Event was successfully denied.")
                }, (error) => {
                  console.log(error);
                }
            );
        }, [events]
    )

    

    useEffect(() => {
        if (!!events){
            let mappedEvents = events.map((event) => <PendingEvent event={event} key={event.id} approveButtonPressedFunc={approveButtonPressed} denyButtonPressedFunc={denyButtonPressed}/>)
            setListedEvents(mappedEvents);
        }
    }, [approveButtonPressed, denyButtonPressed, events])

    return <>
            <center><h3>Pending events</h3></center>
            <br/>
            {listedEvents}
            <p className='mt-3'></p> 
        </>
}

