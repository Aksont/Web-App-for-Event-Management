import React from 'react';
import '../../../assets/styles/business.css';
import { Row, Col } from 'react-bootstrap';
import FixedWidthRegButton from '../../buttons/FixedWidthRegButton';
import { useState, useEffect } from 'react';
import { getQR } from '../../../services/api/TicketApi';

export default function QRCode({ticket}){

    const [qrImageData, setQrImageData] = useState();

    useEffect(() => {
        console.log("evo nas u qr")
        getQR(ticket.id).then(
            (response) => {
                const qr = response.data.qr;
                setQrImageData(qr)
            }, (error) => {
                console.log(error);
            }
        )
    }, [ticket])

    if (!!qrImageData){
        return <img src={`data:image/png;base64,${qrImageData}`} alt="QR Code" />
    }
    
}

