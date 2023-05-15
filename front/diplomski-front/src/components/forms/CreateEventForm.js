import {useState, useEffect, useRef, useCallback} from 'react';
import {checkLettersInput, checkEmailInput, checkPasswordInput } from '../../services/utils/InputValidation';
import { Form, Button, Container, Col, Row} from 'react-bootstrap';
import { sendRegistrationRequest } from '../../services/api/LoginApi';
import LabeledInput from './LabeledInput';
import '../../assets/styles/buttons.css';
import { useNavigate  } from "react-router-dom";  
import { getRole } from '../../services/utils/AuthService';
import LabeledTextarea from './LabeledTextarea';

export function CreateEventForm() {
   
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
        console.log(eventType)

      if (validateInput()) {
        
        // postRegistrationRequest(e);
      } else {
        console.log("Invalid input")
        alert("Invalid input")
      }
    }

    const validateInput = () => {
      let valid = name.length > 0  && 
                  address.length > 0 && 
                  city.length > 0 && 
                  !!eventType && 
                  !!startDate && 
                  !!endDate && 
                  !!startTime && 
                  !!endTime
                  ; 

      return valid;
    }

    const handleSelectEventType = (e) => {
        setEventType(e.target.value);
      };

    // const postRegistrationRequest = useCallback(
    //     (e) => {
    //         e.preventDefault();
    //         const userJson = {name, lastname, email, password, isBusiness}
    //         // console.log(userJson)
    //         sendRegistrationRequest(userJson).then(
    //             (response) => {
    //                 console.log(response);
    //                 alert("Thank you for registering!.");
    //                 navigate("/login");
    //             }, (error) => {
    //               console.log(error);
    //             }
    //         );
    //     }, [name, lastname, email, password, isBusiness, navigate]
    // )

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