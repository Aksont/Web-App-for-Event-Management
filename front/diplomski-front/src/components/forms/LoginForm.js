import {useState, useEffect, useRef, useCallback} from 'react';
import {checkLettersInput, checkEmailInput, checkPasswordInput } from '../../services/utils/InputValidation';
import { Form, Button, Container, Col, Row} from 'react-bootstrap';
import { sendLoginRequest } from '../../services/api/LoginApi';
import LabeledInput from './LabeledInput';
import '../../assets/styles/buttons.css';
import { useNavigate  } from "react-router-dom";    
import { setToken, getToken } from '../../services/utils/AuthService';
import { getRole } from '../../services/utils/AuthService';

export function LoginForm() {
    

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pin, setPin] = useState("");

    const navigate = useNavigate ();
    const userRole = sessionStorage.getItem("userRole");

    useEffect(() => {
        if(!!userRole){
            navigate("/" + userRole.toLowerCase());
        }
    }, [navigate, userRole])

    const loginButtonPressed = (e) => {
      if (validateInput()) {
        postLoginRequest(e);
      } else {
        console.log("Invalid input")
        alert("Invalid input")
      }
    }

    const validateInput = () => {
      let valid = (checkEmailInput(email) && email.length > 0 ) && 
                  password.length > 0 && 
                  pin.length > 0 
                  ;

      return valid;
    }

    const postLoginRequest = useCallback(
        (e) => {
            e.preventDefault();
            const userJson = {email, password, pin}
            console.log(userJson)

            sendLoginRequest(userJson).then(
                (response) => {
                    console.log(response);
                    const token = response.data.jwt;
                    console.log(token);

                    setToken(token)

                    let userRole = getRole();
                    // sessionStorage.setItem("userRole", userRole);

                    navigate("/" + userRole.toLowerCase());
                    window.dispatchEvent(new Event("userRoleUpdated"));
                    return response;
                }, (error) => {
                  console.log(error);
                }
            );
        }, [email, password, pin]
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
                                Login
                            </Col>
                            <Col sm={4}/>
                        </Row> 
                        <LabeledInput value={email} label="Email" inputName="email" placeholder="Type your email" required onChangeFunc={setEmail}/>
                        <LabeledInput value={password} label="Password" inputName="password" placeholder="Type your password" required onChangeFunc={setPassword}/>
                        <LabeledInput value={pin} label="Pin" inputName="password" placeholder="Type your PIN" required onChangeFunc={setPin}/>
    
                        <Row className='mt-2'>
                            <Col sm={4}/>
                            <Col sm={4} align='center'>
                                <Button className='formButton' onClick={loginButtonPressed}>
                                    Login
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