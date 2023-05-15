import {useState, useEffect, useRef, useCallback} from 'react';
import {checkLettersInput, checkEmailInput, checkPasswordInput } from '../../services/utils/InputValidation';
import { Form, Button, Container, Col, Row} from 'react-bootstrap';
import { sendRegistrationRequest } from '../../services/api/LoginApi';
import LabeledInput from './LabeledInput';
import '../../assets/styles/buttons.css';
import { useNavigate  } from "react-router-dom";  
import { getRole } from '../../services/utils/AuthService';

export function RegistrationForm() {
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [isBusiness, setIsBusiness] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypedPassword, setRetypedPassword] = useState("");

    const userRole = getRole();
    const navigate = useNavigate();

    useEffect(() => {
        if(!!userRole){
            navigate("/" + userRole.toLowerCase());
        }
    }, [navigate, userRole])

    const registerButtonPressed = (e) => {
      if (validateInput()) {
        postRegistrationRequest(e);
      } else {
        console.log("Invalid input")
        alert("Invalid input")
      }
    }

    const validateInput = () => {
      let valid = (checkLettersInput(name) && name.length > 0 ) && 
                  (checkLettersInput(lastname) && lastname.length > 0 ) && 
                  (checkEmailInput(email) && email.length > 0 ) && 
                  (checkPasswordInput(password) && password.length >= 6 ) && 
                  password === retypedPassword
                  ; 

      return valid;
    }

    const postRegistrationRequest = useCallback(
        (e) => {
            e.preventDefault();
            const userJson = {name, lastname, email, password, isBusiness}
            // console.log(userJson)
            sendRegistrationRequest(userJson).then(
                (response) => {
                    console.log(response);
                    alert("Thank you for registering!.");
                    navigate("/login");
                }, (error) => {
                  console.log(error);
                }
            );
        }, [name, lastname, email, password, isBusiness, navigate]
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
                            Registration
                        </Col>
                        <Col sm={4}/>
                  </Row> 

                  <LabeledInput value={name} label="Name" inputName="name" placeholder="Type your name" required onChangeFunc={setName}/>
                  <LabeledInput value={lastname} label="Last name" inputName="lastname" placeholder="Type your lastname" required onChangeFunc={setLastname}/>
                  
                  <Row className='mt-2'>
                        <Col sm={4}/>
                        <Col sm={4} align='center'>
                        <Form.Check 
                            type="checkbox"
                            label="Are you a business?"
                            checked={isBusiness}
                            onChange={(e) => setIsBusiness(e.target.checked)}
                          />
                        </Col>
                        <Col sm={4}/>
                  </Row> 
                  
                  <LabeledInput value={email} label="Email" inputName="email" placeholder="Type your email" required onChangeFunc={setEmail}/>
                  <LabeledInput value={password} label="Password" inputName="password" placeholder="Type your password" required onChangeFunc={setPassword}/>
                  <LabeledInput value={retypedPassword} label="Retyped Password" inputName="retypedPassword" placeholder="Retype your password" required onChangeFunc={setRetypedPassword}/>

                  <Row className='mt-2'>
                        <Col sm={4}/>
                        <Col sm={4} align='center'>
                            <Button className='formButton' onClick={registerButtonPressed}>
                                Register
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