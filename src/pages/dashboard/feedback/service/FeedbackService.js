import { BASE_URL } from '../../../../config';
import axios from "axios";
import Cookies from "js-cookie";
const fetchAllFeedbacks = async (authToken) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/admin-feedback`, {
            method: 'GET',
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
                'Access-Token': `${storedTokens}`
            },
        });

        if (response.status === 200) {
            const result = await response.json();
            return result;
        }
    } catch (error) {
        throw error;
    }
};


const deleteFeedback = async (authToken,feedbackId,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.delete(`${BASE_URL}/admin-feedback?id=${feedbackId}`, {
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
                'Access-Token': `${storedTokens}`
            },
        });

        if (response.status === 200) {
            const activity = "Delete Patient.";
            // await saveAuditLog(authToken,loginUser,activity);
            return response; // Assuming the API returns some data on successful deletion
        }
    } catch (error) {
        throw error;
    }
};


export default {
    fetchAllFeedbacks,
    deleteFeedback
};
