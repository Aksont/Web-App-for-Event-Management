import { Form, Row, Col} from 'react-bootstrap';
// import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../assets/styles/form.css';

export default function LabeledInput({label, inputName, placeholder, onChangeFunc, value}){
    return <Row className='mt-2'>
        <Col sm={2} align='right'><Form.Label >{label}</Form.Label></Col>
        <Col sm={9}><Form.Control value={value} name={inputName} placeholder={placeholder}  onChange={(e) => onChangeFunc(e.target.value)} type={inputName==='password' || inputName==='retypedPassword'? "password" : ""}></Form.Control></Col>
        <Col sm={1}/>
    </Row>
}

export function LabeledInputWithErrMessage({isValid, label, inputName, placeholder, onChangeFunc, validationFunc, defaultValue}){

    const className = isValid ? '' : 'myFormControl';
    return <Row className='mt-2'>
        <Col sm={2} align='right'>
            <Form.Label className='inputLabel'>{label}</Form.Label>
        </Col>
        
        <Col sm={9}>
            <Form.Control className={className}
                          name={inputName} 
                          defaultValue={defaultValue} 
                          placeholder={placeholder}  
                          type={inputName==='password' || inputName==='retypedPassword'? "password" : ""}
                          required onChange={(e) => onChangeFunc(e, validationFunc)}>
            </Form.Control>
        </Col>
        
        <Col sm={1} align='right'>
        </Col>
        
    </Row>
}