import {useState, useEffect, useRef, useCallback} from 'react';
import {checkLettersInput, checkEmailInput, checkPasswordInput } from '../../services/utils/InputValidation';
import { Form, Button, Container, Col, Row} from 'react-bootstrap';
import { sendRegistrationRequest } from '../../services/api/LoginApi';
import LabeledInput from './LabeledInput';
import '../../assets/styles/buttons.css';
import { useNavigate  } from "react-router-dom";  

export function RegistrationForm() {
    const [givenName, setName] = useState("");
    const [surname, setLastame] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypedPassword, setRetypedPassword] = useState("");
    const [organization, setOrganization] = useState("");
    const [orgUnit, setOrgUnit] = useState("");
    const [country, setCountry] = useState("");
    const [owner, setIsOwner] = useState(false);

    const userRole = sessionStorage.getItem("userRole");
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
      let valid = (checkLettersInput(givenName) && givenName.length > 0 ) && 
                  (checkLettersInput(surname) && surname.length > 0 ) && 
                  (checkEmailInput(email) && email.length > 0 ) && 
                  (checkPasswordInput(password) && password.length >= 12 ) && 
                  password === retypedPassword &&
                  organization.length > 0 &&
                  orgUnit.length > 0 &&
                  (checkLettersInput(country) && country.length > 0 )
                  ;

      return valid;
    }

    const postRegistrationRequest = useCallback(
        (e) => {
            e.preventDefault();
            const userJson = {givenName, surname, email, password, organization, orgUnit, country, owner}
            // console.log(userJson)
            sendRegistrationRequest(userJson).then(
                (response) => {
                    console.log(response);
                    alert("Thank you for registering! Check your email often for further steps.");
                }, (error) => {
                  console.log(error);
                }
            );
        }, [givenName, surname, email, password, organization, orgUnit, country, owner]
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

                  <LabeledInput value={givenName} label="Name" inputName="name" placeholder="Type your name" required onChangeFunc={setName}/>
                  <LabeledInput value={surname} label="Last name" inputName="lastname" placeholder="Type your lastname" required onChangeFunc={setLastame}/>
                  <LabeledInput value={email} label="Email" inputName="email" placeholder="Type your email" required onChangeFunc={setEmail}/>
                  <LabeledInput value={password} label="Password" inputName="password" placeholder="Type your password" required onChangeFunc={setPassword}/>
                  <LabeledInput value={retypedPassword} label="Retyped Password" inputName="retypedPassword" placeholder="Retype your password" required onChangeFunc={setRetypedPassword}/>
                  <LabeledInput value={organization} label="Organization" inputName="organization" placeholder="Type your organization" required onChangeFunc={setOrganization}/>
                  <LabeledInput value={orgUnit} label="Organizational Unit" inputName="orgUnit" placeholder="Type your organizational unit" required onChangeFunc={setOrgUnit}/>
                  <LabeledInput value={country} label="Country" inputName="country" placeholder="Type your country" required onChangeFunc={setCountry}/>
                  
                  <Row className='mt-2'>
                        <Col sm={4}/>
                        <Col sm={4} align='center'>
                        <Form.Check 
                            type="checkbox"
                            label="Are you the owner of the property?"
                            checked={owner}
                            onChange={(e) => setIsOwner(e.target.checked)}
                          />
                        </Col>
                        <Col sm={4}/>
                  </Row> 

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