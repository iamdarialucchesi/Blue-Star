import {BASE_URL} from '../../../../config';
import axios from "axios";
import Cookies from "js-cookie";

const fetchPatients = async (authToken, order, limit, lastEvaluatedKey, navigate) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');

        let url = `${BASE_URL}/patient?order=${order}&limit=${limit}`;

        // Append LastEvaluatedKey if it's not null
        if (lastEvaluatedKey && lastEvaluatedKey.PatientID) {
            url += `&LastEvaluatedKey=${encodeURIComponent(JSON.stringify(lastEvaluatedKey))}`;
        }
        const response = await fetch(url, {
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


const addPatients = async (authToken,formValues,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/patient`,
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
            if (response.data.Operation === 'SAVE'){
                const activity = "Create Patient.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            else {
                const activity = "Update Patient.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            return response;
        }
    } catch (error) {
        throw error;
    }
};

const uploadPatientDocument = async (authToken,formValues) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/patient/document`,
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

const deletePatients = async (authToken,organizationId,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.delete(`${BASE_URL}/patient/id?id=${organizationId}`, {
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
                'Access-Token': `${storedTokens}`
            },
        });

        if (response.status === 200) {
            const activity = "Delete Patient.";
            await saveAuditLog(authToken,loginUser,activity);
            return response; // Assuming the API returns some data on successful deletion
        }
    } catch (error) {
        throw error;
    }
};

const deletePatientDocument = async (authToken,loginUser,documentID) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.delete(`${BASE_URL}/patient/document?DocumentID=${documentID}`, {
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
                'Access-Token': `${storedTokens}`
            },
        });

        if (response.status === 200) {
            const activity = "Delete Patient Document.";
            await saveAuditLog(authToken,loginUser,activity);
            return response; // Assuming the API returns some data on successful deletion
        }
    } catch (error) {
        throw error;
    }
};

const fetchPatientPatientDocuments = async (authToken,patientID) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/patient/document?PatientID=${patientID}`, {
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

const saveAuditLog = async (authToken,loginUser,activity) => {
    try {
        const currentDate = new Date().toISOString();
        const formValues = {
            UserID: loginUser.UserId,
            UserName: loginUser.Email,
            Activity: activity,
            IPID: '',
            UserType: 'Administrator',
            TimeStamp: currentDate,
        };

        const response = await axios.post(
            `${BASE_URL}/audit-log`,
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
            console.log(response);
        }
    } catch (error) {
        throw error;
    }
};

const filterPatients = async (authToken,formValues) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/patient/filter`,
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
            const result = await response;
            return result;
        }
    } catch (error) {
        throw error;
    }
};






export default {
    fetchPatients,
    addPatients,
    deletePatients,
    uploadPatientDocument,
    deletePatientDocument,
    fetchPatientPatientDocuments,
    filterPatients
};
