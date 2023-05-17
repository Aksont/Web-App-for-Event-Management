import React, { useCallback } from 'react';
import '../../assets/styles/business.css';
import { Row, Col, Button } from 'react-bootstrap';
import FixedWidthRegButton from '../buttons/FixedWidthRegButton';
import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {isCertificateValid, deactivateCertificate } from '../../services/api/CertificatesApi';
import LabeledTextarea from '../forms/LabeledTextarea';
import { useNavigate  } from "react-router-dom";
import { getRole } from '../../services/utils/AuthService';

export default function CertificatePreview(){

    const {id} = useParams();
    const [certificate, setCertificate] = useState(null);
    const [deactivateReason, setDeactivateReason] = useState("");

    // TODO use this when apis available on backend
    //
    // useEffect(() => {
    //     async function fetchCertificate(){
    //         const requestData = await getCertificateById(id);
    //         setCertificate(!!requestData ? requestData.data : {});
    //         return requestData;
    //     }
    //     fetchCertificate();
    // }, [id])

    const userRole = getRole();
    const navigate = useNavigate();

    useEffect(() => {
        if(userRole !== "admin"){
            navigate("/unavailable");
        }
    }, [navigate, userRole])

    useEffect(() => {
        console.log(id)
        for (let c of dummyCertificates){
            console.log(c.id)
            if (c.id.toString() === id){
                setCertificate(c);
            }
        }
        
    }, [id])

    const dummyCertificates = [
        {
          "givenName": "John",
          "surname": "Doe",
          "email": "johndoe@example.com",
          "password": "5tr0ngP@55w0rd!",
          "organization": "Acme Corporation",
          "orgUnit": "Sales",
          "country": "United States",
          "owner": true,
          "endDate": "2024/04/02",
          "valid": true,
          "id": 154
        },
        {
          "givenName": "Jane",
          "surname": "Smith",
          "email": "janesmith@example.com",
          "password": "P@ssw0rd123",
          "organization": "Globex Corporation",
          "orgUnit": "Marketing",
          "country": "Canada",
          "owner": false,
          "endDate": "2024/08/02",
          "valid": true,
          "id": 18
        },
        {
          "givenName": "Michael",
          "surname": "Johnson",
          "email": "michaeljohnson@example.com",
          "password": "SecureP@55",
          "organization": "Initech",
          "orgUnit": "IT",
          "country": "United Kingdom",
          "owner": false,
          "endDate": "2022/04/02",
          "valid": false,
          "id": 5
        },
        {
          "givenName": "Samantha",
          "surname": "Lee",
          "email": "samanthalee@example.com",
          "password": "Pa$$word!",
          "organization": "Tech Solutions",
          "orgUnit": "Development",
          "country": "Australia",
          "owner": true,
          "endDate": "2023/02/02",
          "valid": false,
          "id": 7
        },
        {
          "givenName": "David",
          "surname": "Brown",
          "email": "davidbrown@example.com",
          "password": "C0mpl3xP@55",
          "organization": "ABC Corporation",
          "orgUnit": "Finance",
          "country": "New Zealand",
          "owner": false,
          "endDate": "2026/06/02",
          "valid": true,
          "id": 37
        }
      ]

    const isValidateButtonPressed = (e) => {
        // if (true) {
            getIsValidRequest(e);
        // } else {
            // alert("")
        // }
    }

    const getIsValidRequest = useCallback(
        (e) => {
            e.preventDefault();
            isCertificateValid().then(
                (response) => {
                    console.log(response);
                    if (response.data === true){
                        alert("Certificate is valid.");
                    } else {
                        alert("Certificate is invalid.")
                    }
                }, (error) => {
                    console.log(error);
                }
            );
        }, []
    )

    const deactivateButtonPressed = (e) => {
        if (deactivateReason.length > 0) {
            postDeactivateCertificate(e);
        } else {
            alert("You need to write deactivate reason")
        }
    }

    const postDeactivateCertificate = useCallback(
        (e) => {
            e.preventDefault();
            const deactivateJson = {id, deactivateReason}
            console.log(deactivateJson)
            deactivateCertificate(id, deactivateReason).then(
                (response) => {
                    console.log(response);
                    alert("Certificate " + id + " deactivated.");
                }, (error) => {
                console.log(error);
                }
            );
        }, [deactivateReason, id]
    )
    
    if(!!certificate){
    return <>
            <center><h3>Certificate {id}</h3></center>
            <br/>
            <div className="borderedBlock mt-3 " align="">
                <Row>
                    <Col sm="4">
                        <Row>
                            Name: {certificate.givenName}
                        </Row>
                        <Row>
                            Last name: {certificate.surname}
                        </Row>
                        <Row>
                            Email: {certificate.email}
                        </Row>
                        
                    </Col>
                    <Col sm="4">
                        <Row>
                            Organization: {certificate.organization}
                        </Row>
                        <Row>
                            Organizational unit: {certificate.orgUnit}
                        </Row>
                        <Row>
                            Country: {certificate.country}
                        </Row>
                    </Col>
                    <Col sm="4">
                        <Row>
                            {certificate && <p>Is property owner: {certificate.owner.toString()}</p>}
                        </Row>
                        <Row>
                            Start date: {certificate.startDate}
                        </Row>
                        <Row>
                            End date: {certificate.endDate}
                        </Row>
                    </Col>
                </Row>
            </div>
            <div className="borderedBlock mt-3 " align="">
                
                {/* TODO extensions and templates */}

                <Row className='mt-2'>
                        <Col sm={4}/>
                        <Col sm={4} align='center'>
                            <Button className='formButton' onClick={isValidateButtonPressed}>
                                Validate
                            </Button>
                        </Col>
                        <Col sm={4}/>
                  </Row>
                <br/>

                <LabeledTextarea value={deactivateReason} label="Deactivate reason" inputName="deactivateReason" placeholder="Type reason for deactivating the certificate" required onChangeFunc={setDeactivateReason}/>
                <Row className='mt-2'>
                        <Col sm={4}/>
                        <Col sm={4} align='center'>
                            <Button className='formButton' onClick={deactivateButtonPressed}>
                                Deactivate
                            </Button>
                        </Col>
                        <Col sm={4}/>
                  </Row> 

            </div>
        </>
    } else {
        return "No such certificate"
    }
}

