import React, { useCallback } from 'react';
import '../../../assets/styles/business.css';
import {useEffect, useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
// import { getRole } from '../../services/utils/AuthService';
import { getAvailableEvents } from '../../../services/api/EventApi';
import ListedTicket from './ListedTicket';

export default function TicketsList({tickets}){

    const [listedTickets, setListedTickets] = useState([]);

    useEffect(() => {

        if (!!tickets){
            console.log(tickets)
            let mappedTickets= tickets.map((ticket) => <ListedTicket ticket={ticket}/>)
            setListedTickets(mappedTickets);
        }
    }, [tickets])

    return <>
            <center><h3>Tickets</h3></center>
            <br/>
            {listedTickets}
            {/* just gives nice space in the bottom */}
            <p className='mt-3'></p> 
        </>
}

