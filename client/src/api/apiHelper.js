export const apiRequest = async(axiosCall) => {
    try {
        const response = await axiosCall;
        return { data: response.data, error: null };
    } catch (error) {
        console.error("API error:", error.response || error.message);
        return { data: null, error: {status: error.response?.status, message: error.response?.data?.message} } 
    };
};