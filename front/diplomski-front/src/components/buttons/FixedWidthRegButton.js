import React from 'react';
import '../../assets/styles/buttons.css';
import { Button } from 'react-bootstrap';

export default function FixedWidthRegButton({text, onClickFunction, href}){

    return <Button href={href} variant="custom" className='  formButton pt-0 pb-0 minusMarginButton' onClick={onClickFunction}>
                {text}
            </Button>
}

