import {BASE_URL} from '../../../../config';
import axios from "axios";
import Cookies from "js-cookie";


const fetchAdminInformation = async (authToken,UserId) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/profile?id=${UserId}`, {
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

const updateAdminInformation = async (authToken,formValues) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/profile`,
            {
                formValues
            },
            {
                headers: {
                    Authorization: `${authToken}`,
                    "Content-Type": "application/json",
                    'Access-Token': `${storedTokens}`
                },
            }
        );

        if (response.status === 200) {
            return response;
        }
    } catch (error) {
        throw error;
    }
};

const createPreSignedUrl = async (authToken,UserId) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/profile/url?id=${UserId}`, {
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

const fetchProviderInformation = async (authToken,UserId) => {
    try {
        const response = await fetch(`${BASE_URL}/provider-profile?id=${UserId}`, {
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
        throw error;
    }
};

const updateProviderInformation = async (authToken,formValues) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/provider-profile`,
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
        throw error;
    }
};


export default {
    fetchAdminInformation,
    updateAdminInformation,
    createPreSignedUrl,
    fetchProviderInformation,
    updateProviderInformation
};
