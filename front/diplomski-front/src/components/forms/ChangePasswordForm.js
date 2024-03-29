import {useState, useEffect, useRef, useCallback} from 'react';
import {checkPasswordInput } from '../../services/utils/InputValidation';
import { Form, Button, Container, Col, Row} from 'react-bootstrap';
import LabeledInput from './LabeledInput';
import '../../assets/styles/buttons.css';
import { putChangePasswordRequest } from '../../services/api/UserApi';
import { getLoggedUserEmail } from '../../services/utils/AuthService';

export function ChangePasswordForm() {

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [retypedPassword, setRetypedNewPassword] = useState("");

    const changePasswordButtonPressed = (e) => {
      if (validateInput()) {
        changePassword(e);
      } else {
        console.log("Invalid input")
        alert("Invalid input")
      }
    }

    const validateInput = () => {
      let valid = newPassword.length > 0 && checkPasswordInput(newPassword)
                    && retypedPassword === newPassword;
                  ;

      return valid;
    }

    const emptyFields = () => {
        setPassword("");
        setNewPassword("");
        setRetypedNewPassword("");
    }

    const changePassword = useCallback(
        (e) => {
            e.preventDefault();
            const email = getLoggedUserEmail();
            const passwordJson = {email, password, newPassword, retypedPassword};
            console.log(passwordJson)

            putChangePasswordRequest(passwordJson).then(
                (response) => {
                    emptyFields();
                    alert("Successfuly updated password.");
                }, (error) => {
                    console.log(error.message);
                  alert("Error while updating password");
                }
            );
        }, [newPassword, password, retypedPassword]
    )

    return (<>
        <Row className='mt-5' >
            <Col sm={2} />
            <div className="borderedBlock">
                <Col sm={true} >
                    <Form>
                        <LabeledInput value={password} label="Password" inputName="password" placeholder="Type your current password" required onChangeFunc={setPassword}/>
                        <LabeledInput value={newPassword} label="New password" inputName="password" placeholder="Type your new password" required onChangeFunc={setNewPassword}/>
                        <LabeledInput value={retypedPassword} label="Retyped new password" inputName="password" placeholder="Retype your new password" required onChangeFunc={setRetypedNewPassword}/>
    
                        <Row className='mt-2'>
                            <Col sm={4}/>
                            <Col sm={4} align='center'>
                                <Button className='formButton' onClick={changePasswordButtonPressed}>
                                    Change password
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