import { getApiCall, getApiCallUrlEncoded, getUserApiCall, getUserApiCallNoToken } from "../Configs.js";


export async function sendRegistrationRequest(regRequest){
    try {
        const responseData = await getUserApiCallNoToken().post(`/register`, regRequest);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function sendLoginRequest(loginJson){
    try {
        const responseData = await getUserApiCallNoToken().post(`/login`, loginJson);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function sendLogoutRequest(){
//     try {
//         const responseData = await getApiCall().get("/logout");
//         return responseData;
//     } catch (err) {
//         console.log(err.message);
//         return err.message
//     }
}

export async function putChangePasswordRequest(passwordJson){
    try {
        const responseData = await getUserApiCall().put(`/change-password`, passwordJson);
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}