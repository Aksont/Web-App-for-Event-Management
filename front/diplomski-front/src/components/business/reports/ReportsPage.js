import React, { useCallback } from 'react';
import '../../../assets/styles/business.css';
import {useEffect, useState} from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
// import { getRole } from '../../services/utils/AuthService';
import { getAvailableEvents } from '../../../services/api/EventApi';
import { getUserEvents } from '../../../services/api/EventApi';
import { getLoggedUserEmail } from '../../../services/utils/AuthService';
import { FilterForm } from '../../forms/FilterForm';
import { ReportForm } from '../../forms/ReportForm';
import ReportCharts from './ReportCharts';

export default function ReportsPage(){

    const [report, setReport] = useState();


    return <>
        <br/>
        <center><h1>Reports</h1></center>
        <ReportForm setReportFunc={setReport}/>
        <ReportCharts data={report} />
        <br/>
        {report ? <center><h2>{"Total income: " + report.reduce((acc, { income }) => acc + income, 0)}<br/>{" Total number of tickets: " + report.reduce((acc, { numOfTickets }) => acc + numOfTickets, 0) + ""}</h2><br/><br/></center>: null}
    </>
}

