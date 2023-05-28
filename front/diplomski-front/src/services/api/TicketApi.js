import { getTicketApiCall } from "../Configs.js";

export async function postBuyTicketRequest(ticketDTO){
    try {
        const responseData = await getTicketApiCall().post(`/buy-ticket/`, ticketDTO);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getTicketRequest(id){
    try {
        const responseData = await getTicketApiCall().get(`/ticket/` + id);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getUserTickets(email){
    try {
        const responseData = await getTicketApiCall().get(`/tickets/` + email);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getQR(ticketId){
    try {
        const responseData = await getTicketApiCall().get(`/qr/` + ticketId);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function postReportRequest(reportDTO){
    try {
        const responseData = await getTicketApiCall().post(`/report`, reportDTO);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}