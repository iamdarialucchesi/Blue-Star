import {BASE_URL} from '../../../config';
import Cookies from "js-cookie";
import axios from "axios";

const fetchAllNotifications = async (authToken) => {
    try {
        const response = await fetch(`${BASE_URL}/notification`, {
            method: 'GET',
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 200) {
            const result = await response.json();
            return result;
        }
    } catch (error) {
        if (error.toString() === 'TypeError: Failed to fetch') {
            console.log(error.response);
        }
    }
};

const makeNotificationsAsRead = async (authToken) => {
    try {
        const formValues = {};
        const response = await axios.post(
            `${BASE_URL}/notification`,
            {
                formValues
            },
            {
                headers: {
                    Authorization: `${authToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 200) {
            return response;
        }
    } catch (error) {
        if (error) {
            console.log("error");
            console.log(error);
        }
        throw error;
    }
};




export default {
    fetchAllNotifications,
    makeNotificationsAsRead
};
