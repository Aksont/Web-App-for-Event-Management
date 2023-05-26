import {getEventApiCall } from "../Configs.js";

export async function sendEventCreationRequest(eventDTO){
    try {
        const responseData = await getEventApiCall().post(`/create-event`, eventDTO);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getEvent(id){
    try {
        const responseData = await getEventApiCall().get(`/event/` + id);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAvailableEvents(){
    try {
        const responseData = await getEventApiCall().get(`/available-events`);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getPendingEvents(){
    try {
        const responseData = await getEventApiCall().get(`/pending-events`);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getUserEvents(email){
    try {
        const responseData = await getEventApiCall().get(`/events/` + email);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getActivePrice(id){
    try {
        const responseData = await getEventApiCall().get(`/price/` + id);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function putApproveRequest(id){
    try {
        const responseData = await getEventApiCall().put(`/approve/` + id);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function putDenyRequest(id){
    try {
        const responseData = await getEventApiCall().put(`/deny/` + id);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function postFilterRequest(filterDTO){
    try {
        const responseData = await getEventApiCall().post(`/filter`, filterDTO);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}
