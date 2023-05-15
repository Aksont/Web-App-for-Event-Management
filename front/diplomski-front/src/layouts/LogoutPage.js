import React, { useCallback, useEffect } from 'react';
import { useNavigate  } from "react-router-dom";    
import { removeToken } from '../services/utils/AuthService';
import { sendLogoutRequest } from '../services/api/LoginApi';

export default function LogoutPage(){

    const navigate = useNavigate ();

    useEffect(() => {
        sendLogoutRequest().then(
            (response) => {
                console.log("logout");
                sessionStorage.removeItem("role")
                sessionStorage.removeItem("email")
                removeToken();
                window.dispatchEvent(new Event("userUpdated"));
                navigate('/login');
                return response;
            }, (error) => {
              console.log(error);
            }
        );
    })

    return <>Loging out...</>
}

