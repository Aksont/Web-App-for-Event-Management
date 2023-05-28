import React, { useCallback } from 'react';
import '../../../assets/styles/business.css';
import {useEffect, useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { getLoggedUserEmail } from '../../../services/utils/AuthService';
import TicketsList from './TicketsList';
import { getUserTickets } from '../../../services/api/TicketApi';
import { getUserType } from '../../../services/utils/AuthService';

export default function TicketsPage(){

    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let role = getUserType();
        
        if (role !== "PHYSICAL"){
            navigate("/unavailable")
        }
    }, [navigate])

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

