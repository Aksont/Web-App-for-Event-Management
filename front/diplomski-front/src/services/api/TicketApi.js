import { getTicketApiCall } from "../Configs.js";

export async function postBuyTicketRequest(ticketDTO){
    try {
        const responseData = await getTicketApiCall().post(`/buy-ticket/`, ticketDTO);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}