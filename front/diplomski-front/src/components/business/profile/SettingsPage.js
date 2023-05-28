import React, { useCallback } from 'react';
import '../../../assets/styles/business.css';
import {useEffect, useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { getLoggedUserEmail } from '../../../services/utils/AuthService';
import { ChangePasswordForm } from '../../forms/ChangePasswordForm';

export default function SettingsPage(){

    const navigate = useNavigate();

    useEffect(() => {
        let u = getLoggedUserEmail();
        
        if (!u){
            navigate("/unavailable")
        }
    }, [navigate])

    return <>
            <Row className='mt-2'>
                <Col sm={4}/>
                <Col sm={4} align='center'>
                    <h2>Settings</h2>
                </Col>
                <Col sm={4}/>
            </Row> 
            <ChangePasswordForm />
        </>
}

