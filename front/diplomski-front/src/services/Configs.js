import axios from 'axios'
import { getToken, getTokenWithNoQuotes } from './utils/AuthService';

export var getUserApiCall = () =>{
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

    // headers:  {"Authorization" : `Bearer ${token}`,
    //                 "Content-Type": "application/json"}

} 

export var getEventApiCall = () =>{
    // return axios.create({
    //     baseURL: "https://us-central1-diplomski-379607.cloudfunctions.net/event-service",
    //     headers:  {
    //                 "Content-Type": "application/json"}
    // });

    return axios.create({
        baseURL: "http://localhost:8091",
        headers:  {
                    "Content-Type": "application/json"}
    });
} 

export var getTicketApiCall = () =>{
    // return axios.create({
    //     baseURL: "https://us-central1-diplomski-379607.cloudfunctions.net/ticket-service",
    //     headers:  {
    //                 "Content-Type": "application/json"}
    // });

    return axios.create({
        baseURL: "http://localhost:8092",
        headers:  {
                    "Content-Type": "application/json"}
    });
} 

export var getApiCall = () =>{
    return axios.create({
        baseURL: "http://localhost:8081",
        headers:  {
                    "Content-Type": "application/json"}
    });

    // headers:  {"Authorization" : `Bearer ${token}`,
    //                 "Content-Type": "application/json"}

} 

export var getApiCallWithToken = () =>{
    const token = getTokenWithNoQuotes();
    return axios.create({
        baseURL: "http://localhost:8081",
        headers:  {"Authorization" : `Bearer ` + token,
                    "Content-Type": "application/json"}
    });

    // headers:  {"Authorization" : `Bearer ${token}`,
    //                 "Content-Type": "application/json"}

} 

export var getApiCallUrlEncoded = () =>{
    const token = getTokenWithNoQuotes();
    return axios.create({
        baseURL: "http://localhost:8081",
        headers:  {"Authorization" : `Bearer ` + token,
                    'Content-Type': 'application/x-www-form-urlencoded'}
    });

    // headers:  {"Authorization" : `Bearer ${token}`,
    //                 "Content-Type": "application/json"}

} 




