import React, { useCallback } from 'react';
import '../../../assets/styles/business.css';
import {useEffect, useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
// import { getRole } from '../../services/utils/AuthService';
import { getAvailableEvents } from '../../../services/api/EventApi';
import { getUserEvents } from '../../../services/api/EventApi';
import { getLoggedUserEmail } from '../../../services/utils/AuthService';
import { ChangePasswordForm } from '../../forms/ChangePasswordForm';

export default function SettingsPage(){
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

