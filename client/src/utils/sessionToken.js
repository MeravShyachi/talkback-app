export const setSessionAuthToken = (token) =>{
    sessionStorage.setItem("authToken", token);
    window.dispatchEvent(new Event("authChange"));
}

export const removeSessionAuthToken = () =>{
    sessionStorage.removeItem("authToken");
    window.dispatchEvent(new Event("authChange"));
} 