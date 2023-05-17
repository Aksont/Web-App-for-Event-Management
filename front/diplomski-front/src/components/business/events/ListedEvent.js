import React from 'react';
import '../../../assets/styles/business.css';
import { Row, Col } from 'react-bootstrap';
import FixedWidthRegButton from '../../buttons/FixedWidthRegButton';
import { useState, useEffect } from 'react';
import { getActivePrice } from '../../../services/api/EventApi';

export default function ListedEvent({event, type}){
    const detViewUrl = "/explore/" + event.id;

    const [changabledCollumn, setChangabledCollumn] = useState("");

    useEffect(() => {
        if (type === "EXPLORE"){
            getActivePrice(event.id).then(
                (response) => {
                    setChangabledCollumn(response.data);
                }
            )
        } else if ("MYEVENTS"){
            setChangabledCollumn(determineStatus(event));
        }
    }, [event, type])

    const determineStatus = (event) => {
        if (event.status !== "ACTIVE" 
            || getTodayDate() < event.startDate
            || (getTodayDate() === event.startDate && getCurrentTime() < event.startTime)){
            return event.status;
        } 

        if (getTodayDate() > event.endDate
            || (getTodayDate() === event.endDate && getCurrentTime() > event.endTime)){
            return "DONE"
        } else {
            return "ON GOING"
        }
    }

    function getTodayDate(){
        let date_ob = new Date();
        // adjust 0 before single digit date
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
    
        // date in YYYY-MM-DD format
        let todaysDate = year + "-" + month + "-" + date;
    
        return todaysDate;
    }
    
    function getCurrentTime() {
        const currentTime = new Date();
        const hours = String(currentTime.getHours()).padStart(2, '0');
        const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    
        return `${hours}:${minutes}`;
    }

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
                    <Col sm="2">
                        {event.name}
                    </Col>
                    <Col sm="2">
                        {capitalizeCity(event.city)}
                    </Col>
                    <Col sm="2">
                        {event.startDate}
                    </Col>
                    <Col sm="2">
                        {event.startTime}
                    </Col>
                    <Col sm="2">
                        {changabledCollumn}
                    </Col>
                    
                    <Col sm="2">
                        <div className='mt-4'>
                            <FixedWidthRegButton href={detViewUrl} text='Preview' onClickFunction={''}/>
                        </div>
                        
                    </Col>
                </Row>
            </div>
}

