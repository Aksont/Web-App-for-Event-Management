import { getApiCall, getApiCallUrlEncoded, getEventApiCall } from "../Configs.js";

export async function sendEventCreationRequest(eventDTO){
    try {
        const responseData = await getEventApiCall().post(`/create-event`, eventDTO);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}