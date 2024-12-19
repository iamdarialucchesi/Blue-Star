import {BASE_URL} from '../../../../config';
import axios from "axios";
import Cookies from "js-cookie";
const fetchPatients = async (authToken,OrganizationID,order) => {
    try {
        const response = await fetch(`${BASE_URL}/provider-patients?OrganizationID=${OrganizationID}&order=${order}`, {
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

const filterAllPatients = async (authToken,formValues) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/provider-patients/filter`,
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
            const result = await response;
            return result;
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {

        }
        throw error;
    }
};

const deletePatient = async (authToken,organizationId,loginUser) => {
    try {
        const response = await axios.delete(`${BASE_URL}/provider-patients/id?id=${organizationId}`, {
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            const activity = "Delete Patient.";
            await saveAuditLog(authToken,loginUser,activity);
            return response; // Assuming the API returns some data on successful deletion
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access
        }
        throw error;
    }
};

const createPatient = async (authToken,formValues,loginUser) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/provider-patients`,
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
        if (error.response && error.response.status === 401) {

        }
        throw error;
    }
};

const fetchPatientPatientDocuments = async (authToken,patientID) => {
    try {
        const response = await fetch(`${BASE_URL}/provider-patients/document?PatientID=${patientID}`, {
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

const uploadPatientDocument = async (authToken,formValues) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/provider-patients/document`,
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


const deletePatientDocument = async (authToken,loginUser,documentID) => {
    try {
        const response = await axios.delete(`${BASE_URL}/provider-patients/document?DocumentID=${documentID}`, {
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            const activity = "Delete Patient Document.";
            await saveAuditLog(authToken,loginUser,activity);
            return response; // Assuming the API returns some data on successful deletion
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access
        }
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
        if (error.response) {
            console.log("error.response");
            console.log(error.response);
        }
        throw error;
    }
};





export default {
    fetchPatients,
    filterAllPatients,
    createPatient,
    deletePatient,
    fetchPatientPatientDocuments,
    uploadPatientDocument,
    deletePatientDocument
};
