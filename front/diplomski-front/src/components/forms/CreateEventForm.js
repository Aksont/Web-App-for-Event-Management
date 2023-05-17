import {useState, useEffect, useRef, useCallback} from 'react';
import {checkLettersInput, checkEmailInput, checkPasswordInput, checkDateInput, isHhMm } from '../../services/utils/InputValidation';
import { Form, Button, Container, Col, Row} from 'react-bootstrap';
import { sendRegistrationRequest } from '../../services/api/UserApi';
import LabeledInput from './LabeledInput';
import '../../assets/styles/buttons.css';
import { useNavigate  } from "react-router-dom";  
import { getUserType } from '../../services/utils/AuthService';
import LabeledTextarea from './LabeledTextarea';
import { isPositiveNumber } from '../../services/utils/InputValidation';
import { sendEventCreationRequest } from '../../services/api/EventApi';
import { getLoggedUserEmail } from '../../services/utils/AuthService';

export function CreateEventForm() {
   
    const navigate = useNavigate();
    const possibleEventTypes = ["MUSIC", "NATURE", "EDUCATION", "OTHER"];
   
    // name, address, city, eventType, startDate, endDate, startTime, endTime, status, dateCreated
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [eventType, setEventType] = useState(possibleEventTypes[0]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    const createButtonPressed = (e) => {
      if (validateInput()) {
        postEventCreationRequest(e);
      } else {
        console.log("Invalid input")
        alert("Invalid input")
      }
    }

    const validateInput = () => {
        // console.log("=====")
        // console.log(name.length > 0);
        // console.log(address.length > 0);
        // console.log(city.length > 0 && checkLettersInput(city));
        // console.log(!!eventType);
        // console.log(checkDateInput(startDate));
        // console.log(checkDateInput(endDate));
        // console.log(isHhMm(startTime));
        // console.log(isHhMm(endTime));
        // console.log(price.length > 0 && isPositiveNumber(price));
        // console.log("=====")

      let valid = name.length > 0 && 
                  address.length > 0 && 
                  city.length > 0 && checkLettersInput(city) &&
                  !!eventType && 
                  checkDateInput(startDate) && 
                  checkDateInput(endDate) && 
                  isHhMm(startTime) && 
                  isHhMm(endTime) &&
                  (isPositiveNumber(price) || price === "0")
                  ; 

        // console.log(valid);

      return valid;
    }

    const emptyFields = () => {
        setName("");
        setAddress("");
        setCity("");
        setEventType("MUSIC");
        setStartDate("");
        setEndDate("");
        setStartTime("");
        setEndTime("");
        setPrice("");
        setDescription("");
    }

    const handleSelectEventType = (e) => {
        setEventType(e.target.value);
      };

    const postEventCreationRequest = useCallback(
        (e) => {
            e.preventDefault();
            const organizerEmail = getLoggedUserEmail();
            const userJson = {organizerEmail, name, address, city, eventType, startDate, endDate, startTime, endTime, price, description}
            console.log(userJson)
            sendEventCreationRequest(userJson).then(
                (response) => {
                    console.log(response);
                    alert("Event was successfully created and sent for approval.")
                    emptyFields();
                }, (error) => {
                  console.log(error);
                }
            );
        }, [name, address, city, eventType, startDate, endDate, startTime, endTime, price, description]
    )

    return (<>
    <Row className='mt-5' >
        <Col sm={2} />
        <div className="borderedBlock">
            <Col sm={true} >
                <Form>
                    <Row className='mt-2'>
                            <Col sm={4}/>
                            <Col sm={4} align='center'>
                                Organize a new event
                            </Col>
                            <Col sm={4}/>
                    </Row> 

                    <LabeledInput value={name} label="Name" inputName="name" placeholder="Type event name" required onChangeFunc={setName}/>
                    <LabeledInput value={address} label="Address" inputName="address" placeholder="Type event address" required onChangeFunc={setAddress}/>
                    <LabeledInput value={city} label="City" inputName="city" placeholder="Type event city" required onChangeFunc={setCity}/>

                {/* event type dropbox */}

                    <Row className='mt-2'>
                        <Col sm={4}/>
                        <Col sm={4} align='center'>
                            <Form.Select onChange={handleSelectEventType}>
                                <option value="MUSIC">Music</option>
                                <option value="NATURE">Nature</option>
                                <option value="EDUCATION">Education</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                        </Col>
                        <Col sm={4}/>
                    </Row> 

                    <LabeledInput value={startDate} label="Start date" inputName="startDate" placeholder="yyyy-mm-dd" required onChangeFunc={setStartDate}/>
                    <LabeledInput value={endDate} label="End date" inputName="endDate" placeholder="yyyy-mm-dd" required onChangeFunc={setEndDate}/>
                    <LabeledInput value={startTime} label="Start time" inputName="startTime" placeholder="hh:mm" required onChangeFunc={setStartTime}/>
                    <LabeledInput value={endTime} label="End time" inputName="endTime" placeholder="hh:mm" required onChangeFunc={setEndTime}/>
                    
                    <LabeledInput value={price} label="Price" inputName="price" placeholder="Type price" required onChangeFunc={setPrice}/>

                    <LabeledTextarea value={description} label="Description" inputName="description" placeholder="Type description of the event" required onChangeFunc={setDescription}/>

                    <Row className='mt-2'>
                            <Col sm={4}/>
                            <Col sm={4} align='center'>
                                <Button className='formButton' onClick={createButtonPressed}>
                                    Create event
                                </Button>
                            </Col>
                            <Col sm={4}/>
                    </Row> 

                </Form>
            </Col>
        </div>
        <Col sm={2} />
    </Row>
    </>
    );
}