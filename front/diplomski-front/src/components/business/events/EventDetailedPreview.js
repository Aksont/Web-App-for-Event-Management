import React from 'react';
import '../../../assets/styles/business.css';
import { Row, Col } from 'react-bootstrap';
import FixedWidthRegButton, { FixedWidthRegButtonRed, FixedWidthRegButtonGreen } from '../../buttons/FixedWidthRegButton';
import { useState, useEffect, useCallback } from 'react';
import { getActivePrice } from '../../../services/api/EventApi';
import { getEvent } from '../../../services/api/EventApi';
import { useParams } from 'react-router-dom';
import { BuyTicketForm } from '../../forms/BuyTicketForm';
import MapContainer from './MapContainer';

export default function EventDetailedPreview(){

    const {id} = useParams();
    const [event, setEvent] = useState();
    const [price, setPrice] = useState("");
    const [buyForm, setBuyForm] = useState();
    const [mapContainer, setMapContainer] = useState();

    useEffect(() => {
        console.log("id")
        console.log(id)
        getEvent(id).then(
            (response) => {
                console.log(response.data)
                setEvent(response.data);
            }, (error) => {
                console.log(error);
            }
        )
    }, [id])

    useEffect(() => {
        if (!!event){
            getActivePrice(event.id).then(
                (response) => {
                    setPrice(response.data);
                    setBuyForm(<BuyTicketForm event={event} price={response.data} />)
                    const address = event.address + ", " + event.city;
                    setMapContainer(<MapContainer address={address}/>)
                }
            )
        }
    }, [event])

    const capitalizeCity = (city) => {
        const splits = city.split(" ");
        let capitalized = "";

        for (let split of splits){
            capitalized += split.charAt(0).toUpperCase() + split.slice(1) + " ";
        }

        return capitalized;
    }

    if (!!event){
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
        {mapContainer}
        <Row>
            <Col sm="3" />
            <Col sm="6" align='center'>
                Description: {event.eventDescText}
            </Col>
            <Col sm="3" />
        </Row>
    </div>
        {buyForm}
</>
    }
    
}

