import {useState, useEffect, useRef, useCallback} from 'react';
import {checkLettersInput, checkEmailInput, checkPasswordInput } from '../../services/utils/InputValidation';
import { Form, Button, Container, Col, Row} from 'react-bootstrap';
import { sendLoginRequest } from '../../services/api/UserApi';
import LabeledInput from './LabeledInput';
import '../../assets/styles/buttons.css';
import { isPositiveNumber } from '../../services/utils/InputValidation';
import { postBuyTicketRequest } from '../../services/api/TicketApi';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { getLoggedUserEmail } from '../../services/utils/AuthService';

export function BuyTicketForm({event, price}) {

    const CLIENT_ID = "AaC0PuLsNoq_XxCFmDqCESl7FSXoavI_lhT9glsDAeuvDZVNqj2Qjlm8M66jBIfkhiSfPsncBRO-_s9W";
    const[numOfTickets, setNumOfTickets] = useState(0);
    const [purchaseDescription, setPurchaseDescription] = useState("");
    const [purchaseValue, setPurchaseValue] = useState(10);
    const [paypal, setPaypal] = useState();

    const [orderID, setOrderID] = useState();
 
    const buyButtonPressed = (e) => {
      if (validateInput()) {
        postBuyRequest(e);
      } else {
        alert("Invalid input")
      }
    }

    const validateInput = () => {
      let valid = !!numOfTickets && isPositiveNumber(numOfTickets);

      return valid;
    }
    
    const emptyFields = () => {
        setNumOfTickets(0);
    }

    const postBuyRequest = useCallback(
        (e) => {
            e.preventDefault();
            let email = getLoggedUserEmail();

            if (!email){
                email = "testuser@test.com";
            }

            const eventId = event.id;
            const count = numOfTickets;
            const ticketJson = {email, eventId, count, price};
            console.log(ticketJson)
            postBuyTicketRequest(ticketJson).then(
                (response) => {
                    console.log(response);
                    alert("Successfully bought ticket.")
                    emptyFields();
                }, (error) => {
                    console.log(error);
                    alert("Error with saving the tickets.")
                }
            );

        }, [event.id, numOfTickets, price]
    )

    useEffect(() => {
        if (price === 0){
            setPaypal(<Button className='formButton' onClick={buyButtonPressed}>
            Get free tickets
            </Button>);
        } else if (!!numOfTickets && isPositiveNumber(numOfTickets)){
            setPurchaseDescription(event.name + " x" + numOfTickets);
            setPurchaseValue(price * numOfTickets);
            setPaypal(<PayPalScriptProvider options={{ "client-id": CLIENT_ID }}> 
                        <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={(data, actions) => {
                                console.log("order")
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            description: purchaseDescription,
                                            amount: {
                                                currency_code: "USD",
                                                value: purchaseValue,
                                            },
                                        },
                                    ],
                                }).then((orderID) => {
                                        console.log(orderID);
                                        setOrderID(orderID);
                                        return orderID;
                                    });
                        }}

                        onApprove={(data, actions) => {
                            console.log(data)
                            return actions.order.capture().then(function (details) {
                                let email = getLoggedUserEmail();

                                if (!email){
                                    email = "testuser@test.com";
                                }

                                const eventId = event.id;
                                const count = numOfTickets;
                                const ticketJson = {email, eventId, count, price};
                                console.log(ticketJson)
                                postBuyTicketRequest(ticketJson).then(
                                    (response) => {
                                        console.log(response);
                                        alert("Successfully bought ticket.")
                                        emptyFields();
                                    }, (error) => {
                                      console.log(error);
                                      alert("Error with saving the tickets.")
                                    }
                                );
                            });
                        }}

                        onError={(data, actions) => {
                            console.log("error:")
                            console.log(data)
                            console.log("actions:")
                            console.log(actions)
                            alert("An Error occured with your payment ");
                        }}
                        />
                    
                    </PayPalScriptProvider>);
        } else {
            setPaypal(null);
            setPurchaseDescription(event.name );
            setPurchaseValue(0);
        }

    }, [event.name, numOfTickets, price, purchaseDescription, purchaseValue])

    return (<>
        <Row className='mt-5' >
            <Col sm={2} />
            <div className="borderedBlock">
                <Col sm={true} >
                    <Form>
                        <LabeledInput value={numOfTickets} label="Number of tickets" inputName="numOfTickets" placeholder="Type number of tickets" required onChangeFunc={setNumOfTickets}/>
    
                        <Row className='mt-2'>
                        
                            <Col sm={2}/>
                            <Col sm={8} align='center'>
                                {paypal}
                            </Col>
                            <Col sm={2}/>
                        </Row> 
                    </Form>
                </Col>
            </div>
            <Col sm={2} />
        </Row>
        </>
    );
}