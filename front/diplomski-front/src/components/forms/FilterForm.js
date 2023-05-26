import {useState, useEffect, useRef, useCallback} from 'react';
import {checkPasswordInput } from '../../services/utils/InputValidation';
import { Form, Button, Container, Col, Row} from 'react-bootstrap';
import LabeledInput from './LabeledInput';
import '../../assets/styles/buttons.css';
import { postFilterRequest } from '../../services/api/EventApi';
import { checkLettersInput, checkDateInput, isPositiveNumber } from '../../services/utils/InputValidation';

export function FilterForm({setEventsFunc, myUserEmail=""}) {

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [eventType, setEventType] = useState("NONE");
    const [startDateFrom, setStartDateFrom] = useState("");
    const [startDateTo, setStartDateTo] = useState("");
    const [priceFrom, setPriceFrom] = useState("");
    const [priceTo, setPriceTo] = useState("");

    const validateInput = () => {
    let valid = (city.length === 0 || checkLettersInput(city)) &&
                  !!eventType && 
                  (startDateFrom.length === 0 || checkDateInput(startDateFrom)) && 
                  (startDateTo.length === 0 || checkDateInput(startDateTo)) && 
                  (priceFrom.length === 0 || isPositiveNumber(priceFrom) || priceFrom === "0") &&
                  (priceTo.length === 0 ||  isPositiveNumber(priceTo) || priceTo === "0") 
                  ; 

      return valid;
    }

    const emptyFields = () => {
        setName("");
        setCity("");
        setEventType("NONE");
        setStartDateFrom("");
        setStartDateTo("");
        setPriceFrom("");
        setPriceTo("");
    }

    const filterButtonPressed = (e) => {
        if (validateInput()) {
          filterEvents(e);
        } else {
          console.log("Invalid input")
          alert("Invalid input")
        }
      }

    const filterEvents = useCallback(
        (e) => {
            e.preventDefault();
            let filterDTO = {};

            if (name !== ""){
                filterDTO.name = name;
            }
            if (city !== ""){
                filterDTO.city = city.toLowerCase();
            }
            if (eventType !== "NONE"){
                filterDTO.eventType = eventType;
            }
            if (startDateFrom !== ""){
                filterDTO.startDateFrom = startDateFrom;
            }
            if (startDateTo !== ""){
                filterDTO.startDateTo = startDateTo;
            }
            if (priceFrom !== ""){
                filterDTO.priceFrom = priceFrom;
            }
            if (priceTo !== ""){
                filterDTO.priceTo = priceTo;
            }
            if (myUserEmail !== ""){
                filterDTO.userEmail = myUserEmail;
            }
            console.log(filterDTO)

            postFilterRequest(filterDTO).then(
                (response) => {
                    console.log(response.data);
                    setEventsFunc(!!response ? response.data : []);
                    // emptyFields();
                }, (error) => {
                  alert("Invalid filtering");
                }
            );
        }, [city, eventType, myUserEmail, name, priceFrom, priceTo, setEventsFunc, startDateFrom, startDateTo]
    )

    const handleSelectEventType = (e) => {
        setEventType(e.target.value);
      };

    return (<>
        <Row className='mt-5' >
            <Col sm={2} />
            <div className="borderedBlock">
                <Col sm={true} >
                    <Form>
                        <Row className='mt-2'>
                            <Col sm={4}>
                                <LabeledInput value={name} label="Event name" inputName="name" placeholder="Type event name" required onChangeFunc={setName}/>
                            </Col>
                            <Col sm={4} align='center'>
                                <LabeledInput value={city} label="City" inputName="city" placeholder="Type city name" required onChangeFunc={setCity}/>
                            </Col>
                            <Col sm={4}>
                                <Form.Select onChange={handleSelectEventType}>
                                    <option value="NONE">None</option>
                                    <option value="MUSIC">Music</option>
                                    <option value="NATURE">Nature</option>
                                    <option value="EDUCATION">Education</option>
                                    <option value="OTHER">Other</option>
                                </Form.Select>
                            </Col>
                        </Row> 
                        <Row className='mt-2'>
                            <Col sm={6} align='center'>
                                <LabeledInput value={startDateFrom} label="Earliest start date" inputName="startDateFrom" placeholder="Type earliest start date" required onChangeFunc={setStartDateFrom}/>
                            </Col>
                            <Col sm={6} align='center'>
                                <LabeledInput value={startDateTo} label="Latest start date" inputName="startDateTo" placeholder="Type latest start date" required onChangeFunc={setStartDateTo}/>
                            </Col>
                        </Row> 
                        <Row className='mt-2'>
                            <Col sm={6} align='center'>
                                <LabeledInput value={priceFrom} label="Lowest price" inputName="priceFrom" placeholder="Type lowest price" required onChangeFunc={setPriceFrom}/>
                            </Col>
                            <Col sm={6} align='center'>
                                <LabeledInput value={priceTo} label="Highest price" inputName="priceTo" placeholder="Type highest price" required onChangeFunc={setPriceTo}/>
                            </Col>
                        </Row> 
                        <Row className='mt-2'>
                            <Col sm={4}/>
                            <Col sm={4} align='center'>
                                <Button className='formButton' onClick={filterButtonPressed}>
                                    Filter events
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