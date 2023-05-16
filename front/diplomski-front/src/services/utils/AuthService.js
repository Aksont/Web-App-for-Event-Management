import jwtDecode from "jwt-decode";

export const setToken = (token) => {
  if(token === null){
    sessionStorage.setItem("jwt", null);
  }
  else{
    sessionStorage.setItem("jwt", JSON.stringify(token));
  }
}

export const getToken = () => {
   const token = sessionStorage.getItem("jwt");
   
   if (!!token){
    return token;
  } else {
    return "";
  }
}

export const getTokenWithNoQuotes = () => {
  const token = sessionStorage.getItem("jwt");
  
  if (!!token){
    const splitedtoken = token.slice(1, -1);
   return splitedtoken;
 } else {
   return "";
 }
}

export const removeToken = () => {
  return sessionStorage.removeItem("jwt");
}

export const getUserType = () => {
  let role = sessionStorage.getItem("userType");

  return role;
}

export const getLoggedUserEmail = () => {
  let email = sessionStorage.getItem("email");

  return email;
}

export const getDecodedToken = () => {
  const token = getToken();
  if (!!token){
    return jwtDecode(token);
  } else {
    return {};
  }
}

