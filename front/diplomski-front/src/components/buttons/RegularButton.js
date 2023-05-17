import React from 'react';
import '../../assets/styles/buttons.css';
import { Button, Tooltip } from 'react-bootstrap';

export default function RegularButton({text, onClickFunction, disabledReason, disabled=true}){
    const button = <Button variant="custom" className='sameWidthButton formButton pe-5 ps-5 mt-2' disabled={disabled} 
                        style={disabled ? { pointerEvents: "none" } : {}} onClick={onClickFunction}>
                        {text}
                    </Button>
    if(!disabled){
        return button
    }
  return <div className='infoDiv' data-title={disabledReason}>
            {button}
        </div>
}

