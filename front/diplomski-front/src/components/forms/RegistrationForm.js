import {useState, useEffect, useRef, useCallback} from 'react';
import {checkLettersInput, checkEmailInput, checkPasswordInput } from '../../services/utils/InputValidation';
import { Form, Button, Container, Col, Row} from 'react-bootstrap';
import { sendRegistrationRequest } from '../../services/api/UserApi';
import LabeledInput from './LabeledInput';
import '../../assets/styles/buttons.css';
import { useNavigate  } from "react-router-dom";  
import { getUserType } from '../../services/utils/AuthService';

export function RegistrationForm() {
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [isBusiness, setIsBusiness] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypedPassword, setRetypedPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
      let role = getUserType();
        if(!!role){
            navigate("/explore");
        }
    }, [navigate])

    const registerButtonPressed = (e) => {
      if (validateInput()) {
        postRegistrationRequest(e);
      } else {
        alert("Invalid input")
      }
    }

    const validateInput = () => {
      console.log(checkLettersInput(name) && name.length > 0 );  
      console.log            (checkLettersInput(lastname) && lastname.length > 0 ); 
      console.log          (checkEmailInput(email) && email.length > 0 ); 
      console.log         (checkPasswordInput(password) ); 
      console.log         (password === retypedPassword); 

      let valid = (checkLettersInput(name) && name.length > 0 ) && 
                  (checkLettersInput(lastname) && lastname.length > 0 ) && 
                  (checkEmailInput(email) && email.length > 0 ) && 
                  (checkPasswordInput(password) ) && 
                  password === retypedPassword
                  ; 

      return valid;
    }

    const postRegistrationRequest = useCallback(
        (e) => {
            e.preventDefault();

            let userType = "PHYSICAL";
            if (isBusiness){
              userType = "BUSINESS";
            }
            const userJson = {name, lastname, email, password, userType}

            sendRegistrationRequest(userJson).then(
                (response) => {
                    alert("Thank you for registering!.");
                    navigate("/login");
                }, (error) => {
                  alert("Error with the registration.");
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
                  <LabeledInput value={password} label="Password" inputName="password" placeholder="Min 6 chars" required onChangeFunc={setPassword}/>
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