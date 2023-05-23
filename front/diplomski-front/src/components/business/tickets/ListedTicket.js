import React from 'react';
import '../../../assets/styles/business.css';
import { Row, Col } from 'react-bootstrap';
import FixedWidthRegButton from '../../buttons/FixedWidthRegButton';
import { useState, useEffect } from 'react';
import { getActivePrice } from '../../../services/api/EventApi';
import { getEvent } from '../../../services/api/EventApi';

export default function ListedTicket({ticket}){
    const detViewUrl = "/client/tickets/" + ticket.id;

    const [event, setEvent] = useState();

    useEffect(() => {
        console.log("id")
        getEvent(ticket.eventId).then(
            (response) => {
                const _event = response.data;
                console.log(_event);
                setEvent(_event);
            }, (error) => {
                console.log(error);
            }
        )
    }, [ticket])

    if (!!event){
        return <div className="borderedBlock mt-3 " align="">
        <Row>
            <Col sm="3">
                Event: {event.name}
            </Col>
            <Col sm="3">
                Date: {event.startDate}
            </Col>
            <Col sm="2">
                Price: {ticket.price}
            </Col>
            <Col sm="2">
                Count: {ticket.count}
            </Col>
            
            <Col sm="2">
                <div className='mt-4'>
                    <FixedWidthRegButton href={detViewUrl} text='Preview' onClickFunction={''}/>
                </div>
                
            </Col>
        </Row>
    </div>
    }
    
}

