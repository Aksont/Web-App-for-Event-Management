import React, { useCallback } from 'react';
import '../../../assets/styles/business.css';
import {useEffect, useState} from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { getUserType } from '../../../services/utils/AuthService';
import { ReportForm } from '../../forms/ReportForm';
import ReportCharts from './ReportCharts';

export default function ReportsPage(){

    const [report, setReport] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        let role = getUserType();
        
        if (role !== "BUSINESS"){
            navigate("/unavailable")
        }
    }, [navigate])

    return <>
        <br/>
        <center><h1>Reports</h1></center>
        <ReportForm setReportFunc={setReport}/>
        <ReportCharts data={report} />
        <br/>
        {report ? <center><h2>{"Total income: " + report.reduce((acc, { income }) => acc + income, 0)}<br/>{" Total number of tickets: " + report.reduce((acc, { numOfTickets }) => acc + numOfTickets, 0) + ""}</h2><br/><br/></center>: null}
    </>
}

