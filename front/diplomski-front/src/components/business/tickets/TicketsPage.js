import React, { useCallback } from 'react';
import '../../../assets/styles/business.css';
import {useEffect, useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
// import { getRole } from '../../services/utils/AuthService';
import { getAvailableEvents } from '../../../services/api/EventApi';
import { getUserEvents } from '../../../services/api/EventApi';
import { getLoggedUserEmail } from '../../../services/utils/AuthService';
import TicketsList from './TicketsList';
import { getUserTickets } from '../../../services/api/TicketApi';

export default function TicketsPage(){

    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        let userEmail = getLoggedUserEmail();

        if (!userEmail){
            userEmail = "testuser@test.com";
        }

        getUserTickets(userEmail).then(
            (response) => {
                console.log(response)
                setTickets(!!response ? response.data : []);
            }
        )
    }, [])

    return <>
            <TicketsList tickets={tickets}/>
        </>
}

