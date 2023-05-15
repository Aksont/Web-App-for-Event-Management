import { getApiCall, getApiCallUrlEncoded } from "../Configs.js";


export async function sendRegistrationRequest(regRequest){
//     try {
//         const responseData = await getApiCall().post(`/csr/request`, regRequest);
//         return responseData;
//     } catch (err) {
//         console.log(err.message);
//         return err.message
//     }
}

export async function sendLoginRequest(userJson){
//     try {
//         // let fd = new FormData();
//         var fd = new URLSearchParams();
//         fd.append("username", userJson.email);
//         fd.append("password", userJson.password);
//         fd.append("pin", userJson.pin);
//         const responseData = await getApiCallUrlEncoded().post(`/login`, fd);

//         return responseData;
//     } catch (err) {
//         console.log(err.message);
//         return err.message
//     }
}

export async function sendLogoutRequest(){
    try {
        const responseData = await getApiCall().get("/logout");
        return responseData;
    } catch (err) {
        console.log(err.message);
        return err.message
    }
}