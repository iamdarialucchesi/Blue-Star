import {BASE_URL} from '../../../../../config';
import axios from "axios";
import Cookies from "js-cookie";


const fetchProvidersFeedback = async (authToken,OrganizationID) => {
    try {
        const response = await fetch(`${BASE_URL}/provider-feedback?OrganizationID=${OrganizationID}`, {
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
        if (error.response && error.response.status === 401) {

        }
    }
};

const createProviderFeedback = async (authToken,formValues,loginUser) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/provider-feedback`,
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
        if (error.response && error.response.status === 401) {

        }
        throw error;
    }
};



export default {
    fetchProvidersFeedback,
    createProviderFeedback
};
