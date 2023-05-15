import React from 'react';
import { Form, Row, Col} from 'react-bootstrap';

export default function LabeledTextarea({label, inputName, placeholder, onChangeFunc, value}){
    return <Row className='mt-2'>
        <Col sm={2} align='right'><Form.Label>{label}</Form.Label></Col>
        <Col sm={9}><Form.Control value={value} name={inputName} placeholder={placeholder} as="textarea" onChange={(e) => onChangeFunc(e.target.value)}></Form.Control></Col>
        <Col sm={1}/>
    </Row>
}