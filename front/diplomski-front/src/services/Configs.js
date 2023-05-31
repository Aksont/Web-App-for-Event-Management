import axios from 'axios'
import { getToken } from './utils/AuthService';

export var getUserApiCallNoToken = () =>{
    // return axios.create({
    //     baseURL: "https://us-central1-diplomski-379607.cloudfunctions.net/user-service",
    //     headers:  {
    //                 "Content-Type": "application/json"}
    // });

    return axios.create({
        baseURL: "http://localhost:8090",
        headers:  { 
                    "Content-Type": "application/json"}
    });
} 

export var getUserApiCall = () =>{
    // return axios.create({
    //     baseURL: "https://us-central1-diplomski-379607.cloudfunctions.net/user-service",
    //     headers:  { "Authorization": "Bearer " + getToken(),
    //                 "Content-Type": "application/json"}
    // });

    return axios.create({
        baseURL: "http://localhost:8090",
        headers:  { "Authorization": "Bearer " + getToken(),
                    "Content-Type": "application/json"}
    });
} 

export var getEventApiCall = () =>{
    // return axios.create({
    //     baseURL: "https://us-central1-diplomski-379607.cloudfunctions.net/event-service",
    //     headers:  { "Authorization": "Bearer " + getToken(),
    //                 "Content-Type": "application/json"}
    // });

    return axios.create({
        baseURL: "http://localhost:8091",
        headers:  { "Authorization": "Bearer " + getToken(),
                    "Content-Type": "application/json"}
    });
} 

export var getTicketApiCall = () =>{
    // return axios.create({
    //     baseURL: "https://us-central1-diplomski-379607.cloudfunctions.net/ticket-service",
    //     headers:  { "Authorization": "Bearer " + getToken(),
    //                 "Content-Type": "application/json"}
    // });

    return axios.create({
        baseURL: "http://localhost:8092",
        headers:  { "Authorization": "Bearer " + getToken(),
                    "Content-Type": "application/json"}
    });
} 