import React from 'react';
import '../../../assets/styles/business.css';
import { Row, Col } from 'react-bootstrap';
import FixedWidthRegButton, { FixedWidthRegButtonRed, FixedWidthRegButtonGreen } from '../../buttons/FixedWidthRegButton';
import { useState, useEffect, useCallback } from 'react';
import { getActivePrice } from '../../../services/api/EventApi';

export default function PendingEvent({event, approveButtonPressedFunc, denyButtonPressedFunc}){

    const [price, setPrice] = useState("");

    useEffect(() => {
        getActivePrice(event.id).then(
            (response) => {
                setPrice(response.data);
            }
        )
    }, [event])

    const approveEvent = useCallback(
        (e) => {
            e.preventDefault();
            approveButtonPressedFunc(event.id);
        }, [approveButtonPressedFunc, event.id]
    )

    const denyEvent = useCallback(
        (e) => {
            e.preventDefault();
            denyButtonPressedFunc(event.id);
        }, [denyButtonPressedFunc, event.id]
    )

    const capitalizeCity = (city) => {
        const splits = city.split(" ");
        let capitalized = "";

        for (let split of splits){
            capitalized += split.charAt(0).toUpperCase() + split.slice(1) + " ";
        }

        return capitalized;
    }

    return <div className="borderedBlock mt-3 " align="">
                <Row>
                    <Col sm="4" />
                    <Col sm="4" align='center'>
                        <h3>{event.name}</h3>
                    </Col>
                    <Col sm="4" />
                </Row>
                <Row>
                    <Col sm="3" />
                    <Col sm="3" align='center'>
                        Type: {event.eventType}
                    </Col>
                    <Col sm="3" align='center'>
                        Price: {price}
                    </Col>
                    <Col sm="3" />
                </Row>
                <br/>
                <Row>
                    <Col sm="3" />
                    <Col sm="3" align='center'>
                        Address: {event.address}
                    </Col>
                    <Col sm="3" align='center'>
                        City: {capitalizeCity(event.city)}
                    </Col>
                    <Col sm="3" />
                </Row>
                <br/>
                <Row>
                    <Col sm="3" />
                    <Col sm="3" align='center'>
                        Start date: {event.startDate}
                    </Col>
                    <Col sm="3" align='center'>
                        Start time: {event.startTime}
                    </Col>
                    <Col sm="3" />
                </Row>
                <Row>
                    <Col sm="3" />
                    <Col sm="3" align='center'>
                        End date: {event.endDate}
                    </Col>
                    <Col sm="3" align='center'>
                        End time: {event.endTime}
                    </Col>
                    <Col sm="3" />
                </Row>
                <br/>
                <Row>
                    <Col sm="3" />
                    <Col sm="6" align='center'>
                        Description: {event.eventDescText}
                    </Col>
                    <Col sm="3" />
                </Row>
                <br/>
                <Row>
                    <Col sm="3" />
                    <Col sm="3" align='center'>
                        <div className='mt-4'>
                            <FixedWidthRegButtonGreen text='Approve' onClickFunction={approveEvent}/>
                        </div>
                    </Col>
                    <Col sm="3" align='center'>
                        <div className='mt-4'>
                            <FixedWidthRegButtonRed text='Deny' onClickFunction={denyEvent}/>
                        </div>
                        
                    </Col>
                    <Col sm="3" />
                </Row>
            </div>
}

