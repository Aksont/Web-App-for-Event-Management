import {useState, useEffect, useRef, useCallback} from 'react';
import {checkPasswordInput } from '../../services/utils/InputValidation';
import { Form, Button, Container, Col, Row} from 'react-bootstrap';
import LabeledInput from './LabeledInput';
import '../../assets/styles/buttons.css';
import { getUserEvents } from '../../services/api/EventApi';
import { checkLettersInput, checkDateInput, isPositiveNumber } from '../../services/utils/InputValidation';
import { postReportRequest } from '../../services/api/TicketApi';
import { getLoggedUserEmail } from '../../services/utils/AuthService';

export function ReportForm({setReportFunc}) {

    const [reportType, setReportType] = useState("YEAR");
    const [fromDate, setStartDateFrom] = useState("");
    const [toDate, setStartDateTo] = useState("");
    const [events, setEvents] = useState([]);
    const [eventIds, setEventIds] = useState([]);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        let _userEmail = getLoggedUserEmail();
        setUserEmail(_userEmail);
    }, [])

    useEffect(() => {
        if (!!userEmail){
            getUserEvents(userEmail).then(
                (response) => {
                    console.log(response)
                    let _events = !!response ? response.data : [];
                    let reportForAllEvents = {"id":-1, "name":"ALL", "startDate":""};
                    _events.unshift(reportForAllEvents); // puts as the 1st element
                    console.log(_events)
                    setEvents(_events);
                    setEventIds(_events.filter((event) => event.id !== -1).map((event) => event.id));
                }
            )
        }
    }, [userEmail])

    const validateInput = () => {
    let valid =   (fromDate.length === 0 || checkDateInput(fromDate)) && 
                  (toDate.length === 0 || checkDateInput(toDate))
                  ; 

      return valid;
    }

    const reportButtonPressed = (e) => {
        if (validateInput()) {
          getReport(e);
        } else {
          console.log("Invalid input")
          alert("Invalid input")
        }
      }

    const getReport = useCallback(
        (e) => {
            e.preventDefault();
            let reportDTO = {reportType, fromDate, toDate, eventIds};
            console.log(reportDTO)

            postReportRequest(reportDTO).then(
                (response) => {
                    console.log(response.data);
                    setReportFunc(!!response ? response.data : {});
                }, (error) => {
                  alert("Invalid report");
                }
            );
        }, [reportType, fromDate, toDate, eventIds, setReportFunc]
    )

    const handleSelectReportType = (e) => {
        setReportType(e.target.value);
      };

    const handleSelectEvent = (e) => {
        const id = e.target.value;
        console.log(id);
        if (id < 0){
            setEventIds(events.filter((event) => event.id !== -1).map((event) => event.id));
        } else {
            setEventIds([e.target.value]);
        }
      };

    return (<>
        <Row className='mt-5' >
            <Col sm={2} />
            <div className="borderedBlock">
                <Col sm={true} >
                    <Form>
                        <Row className='mt-2'>
                            <Col sm={4}>
                                <Form.Select onChange={handleSelectReportType}>
                                    <option value="YEAR">Yearly</option>
                                    <option value="MONTH">Monthly</option>
                                </Form.Select>
                            </Col>
                            <Col sm={4} align='center'>
                                <LabeledInput value={fromDate} label="From:" inputName="startDateFrom" placeholder="yyyy-mm-dd" required onChangeFunc={setStartDateFrom}/>
                            </Col>
                            <Col sm={4} align='center'>
                                <LabeledInput value={toDate} label="Until:" inputName="startDateTo" placeholder="yyyy-mm-dd" required onChangeFunc={setStartDateTo}/>
                            </Col>
                        </Row> 
                        <Row className='mt-2'>
                            <Col sm={3} />
                            <Col sm={6} align='center'>
                                <Form.Select onChange={handleSelectEvent}>
                                    {events.map((e) => (
                                        <option key={e.id} value={e.id}>
                                            {e.name + " " + e.startDate}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col sm={3} align='center' />
                        </Row> 
                        <Row className='mt-2'>
                            <Col sm={4}/>
                            <Col sm={4} align='center'>
                                <Button className='formButton' onClick={reportButtonPressed}>
                                    Get report
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