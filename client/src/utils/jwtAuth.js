import axios from "axios";

export const verifyToken = async() =>{
    try {
        const res = await axios.get("http://localhost:4000/auth", { withCredentials: true });
        console.log(res.data);
        return res.data.username;
    }
    catch (error){
        console.log(error);
        return false;
    }
}