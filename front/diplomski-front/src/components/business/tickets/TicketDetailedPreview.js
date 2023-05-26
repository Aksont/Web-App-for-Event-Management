import React from 'react';
import '../../../assets/styles/business.css';
import { Row, Col } from 'react-bootstrap';
import FixedWidthRegButton, { FixedWidthRegButtonRed, FixedWidthRegButtonGreen } from '../../buttons/FixedWidthRegButton';
import { useState, useEffect, useCallback } from 'react';
import { getEvent } from '../../../services/api/EventApi';
import { useParams } from 'react-router-dom';
import { getTicketRequest } from '../../../services/api/TicketApi';
import QRCode from './QRCode';

export default function TicketDetailedPreview(){

    const {id} = useParams();
    const [ticket, setTicket] = useState();
    const [eventId, setEventId] = useState();
    const [event, setEvent] = useState();
    const [eventUrl, setEventUrl] = useState();

    useEffect(() => {
        console.log("id")
        console.log(id)
        getTicketRequest(id).then(
            (response) => {
                const _ticket = response.data;
                console.log(_ticket);
                setTicket(_ticket);
                setEventId(_ticket.eventId);
            }, (error) => {
                console.log(error);
            }
        )
    }, [id])

    useEffect(() => {
        console.log("id")
        if (!!eventId){
            getEvent(eventId).then(
                (response) => {
                    const _event = response.data;
                    console.log(_event);
                    setEvent(_event);
                    setEventUrl("/explore/" + _event.id);
                }, (error) => {
                    console.log(error);
                }
            )
        }
    }, [eventId])

    if (!!ticket && !!event){
        return <><div className="borderedBlock mt-3 " align="">
        <Row>
            <Col sm="4" />
            <Col sm="4" align='center'>
                <h3>{event.name}</h3>
            </Col>
            <Col sm="4" />
        </Row>
        <Row>
            <Col sm="3" />
            <Col sm="6" align='center'>
                Number of tickets: {ticket.count}
            </Col>
            <Col sm="3" />
        </Row>
        <br/>
        <Row>
            <Col sm="3" />
            <Col sm="6" align='center'>
                Price each: {ticket.price}
            </Col>
            <Col sm="3" />
        </Row>
        <br/>
        <Row>
            <Col sm="3" />
            <Col sm="6" align='center'>
                Bought on date: {ticket.boughtOnDate}
            </Col>
            <Col sm="3" />
        </Row>
        <br/>
        <Row>
            <Col sm="3" />
            <Col sm="6" align='center'>
                <QRCode ticket={ticket} />
            </Col>
            <Col sm="3" />
        </Row>
        <br/>
        <Row>
            <Col sm="3" />
            <Col sm="6" align='center'>
                <div className='mt-4'>
                    <FixedWidthRegButton href={eventUrl} text='See event' onClickFunction={''}/>
                </div>
            </Col>
            <Col sm="3" />
        </Row>
        
    </div>
    </>
    }
}

