import {BASE_URL} from '../../../../../config';
import axios from "axios";
import Cookies from "js-cookie";
const fetchProviderPrograms = async (authToken,organizationId,order) => {
    try {
        const response = await fetch(`${BASE_URL}/provider-programs?OrganizationID=${organizationId}&order=${order}`, {
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
        if (error) {
            console.log("error");
            console.log(error);
        }
    }
};

const fetchProgramDetail = async (authToken,programName,organizationId) => {
    try {
        const order = 'desc';
        const response = await fetch(`${BASE_URL}/provider-programs/detail?OrganizationID=${organizationId}&Program=${programName}&order=${order}`, {
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
        if (error) {
            console.log("error");
            console.log(error);
        }
    }
};

const enrollPatientInProgram = async (authToken,formValues,loginUser) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/provider-programs/enroll`,
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

const deleteProviderProgram = async (authToken,programId,loginUser) => {
    try {
        const response = await axios.delete(`${BASE_URL}/provider-programs/id?id=${programId}`, {
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            const activity = "Delete Program.";
            await saveAuditLog(authToken,loginUser,activity);
            return response;
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
    fetchProviderPrograms,
    fetchProgramDetail,
    enrollPatientInProgram,
    deleteProviderProgram
};
