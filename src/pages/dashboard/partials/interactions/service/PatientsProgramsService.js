import {BASE_URL} from '../../../../../config';
import axios from "axios";

const fetchPatientPrograms = async (authToken, organizationId) => {
    try {
        
        // Define the base URL for the API request
        let url = `${BASE_URL}/patients-programs?organizationId=${organizationId}`;

        // Make the API call to fetch patient programs
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `${authToken}`,
                'Content-Type': 'application/json'
            },
        });

        // Check if the request was successful
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error(`Error: Received status code ${response.status}`);
            if (response.status === 403) {
                console.error('Access denied. You do not have permission to view this resource.');
                navigate('/unauthorized'); // Redirect to unauthorized page if access is denied
            } else if (response.status === 404) {
                console.error('Resource not found. Please check the URL.');
            } else if (response.status === 500) {
                console.error('Server error. Please try again later.');
            }
        }
    } catch (error) {
        // Handle network errors or other unexpected errors
        if (error.toString() === 'TypeError: Failed to fetch') {
            console.log('Network error: Unable to reach the server. Please check your connection.');
        } else {
            console.log(`Unexpected error occurred: ${error.message}`);
        }
    }
};

const fetchPatientMessages = async (authToken, patientId, programId) => {
    try {

        // Define the base URL for the API request with query parameters for patientId and programId
        let url = `${BASE_URL}/fetch-messages?patientId=${patientId}&programId=${programId}`;

        // Make the API call to fetch messages for the specific patient and program
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `${authToken}`,
                'Content-Type': 'application/json'
            },
        });

        // Check if the request was successful
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error(`Error: Received status code ${response.status}`);
            if (response.status === 403) {
                console.error('Access denied. You do not have permission to view this resource.');
                navigate('/unauthorized'); // Redirect to unauthorized page if access is denied
            } else if (response.status === 404) {
                console.error('Resource not found. Please check the URL.');
            } else if (response.status === 500) {
                console.error('Server error. Please try again later.');
            }
        }
    } catch (error) {
        // Handle network errors or other unexpected errors
        if (error.toString() === 'TypeError: Failed to fetch') {
            console.log('Network error: Unable to reach the server. Please check your connection.');
        } else {
            console.log(`Unexpected error occurred: ${error.message}`);
        }
    }
};

const fetchConversationEvaluation = async (authToken, patientId, programId) => {
    try {

        // Define the base URL for the API request with query parameters for patientId and programId
        let url = `${BASE_URL}/conversation-evaluation?patientId=${patientId}&programId=${programId}`;

        // Make the API call to fetch messages for the specific patient and program
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `${authToken}`,
                'Content-Type': 'application/json'
            },
        });

        // Check if the request was successful
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error(`Error: Received status code ${response.status}`);
            if (response.status === 403) {
                console.error('Access denied. You do not have permission to view this resource.');
                navigate('/unauthorized'); // Redirect to unauthorized page if access is denied
            } else if (response.status === 404) {
                console.error('Resource not found. Please check the URL.');
            } else if (response.status === 500) {
                console.error('Server error. Please try again later.');
            }
        }
    } catch (error) {
        // Handle network errors or other unexpected errors
        if (error.toString() === 'TypeError: Failed to fetch') {
            console.log('Network error: Unable to reach the server. Please check your connection.');
        } else {
            console.log(`Unexpected error occurred: ${error.message}`);
        }
    }
};

const sendMessage = async (authToken,formValues) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/send-message`,
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
            // Handle unauthorized access
        }
        throw error;
    }
};

const updateAlertResolved = async (authToken,formValues) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/conversation-evaluation/alerts`,
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
            // Handle unauthorized access
        }
        throw error;
    }
};

export default {
    fetchPatientPrograms,
    fetchPatientMessages,
    fetchConversationEvaluation,
    sendMessage,
    updateAlertResolved,
};
