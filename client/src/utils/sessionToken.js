export const setSessionAuthToken = (token, userId) =>{
    sessionStorage.setItem("authToken", token);
    sessionStorage.setItem("userId", userId);
    window.dispatchEvent(new Event("authChange"));
}

export const removeSessionAuthToken = () =>{
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userId");
    window.dispatchEvent(new Event("authChange"));
} 