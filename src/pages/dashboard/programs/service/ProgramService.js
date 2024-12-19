import {BASE_URL} from '../../../../config';
import axios from "axios";
import Cookies from "js-cookie";
const fetchPrograms = async (authToken,order,navigate) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/program?order=${order}`, {
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
        if (error.toString() === 'TypeError: Failed to fetch') {
            // console.log(error.response);
            // await Cookies.remove('authToken');
            // await Cookies.remove('AccessToken');
            // await Cookies.remove('loginUser');
            //
            // navigate('/login', {replace: true});
            // window.location.reload();
        }
    }
};


const saveProgram = async (authToken,formValues,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/program/id`,
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
                const activity = "Create Program.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            else {
                const activity = "Update Program.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            return response;
        }
    } catch (error) {
        if (error.response) {
            // console.log("error.response");
            // console.log(error.response);
        }
        throw error;
    }
};

const deleteProgram = async (authToken,programId,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.delete(`${BASE_URL}/program/id?id=${programId}`, {
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
                'Access-Token': `${storedTokens}`
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

const fetchProgramPatients = async (authToken,programName) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/program/name?name=${programName}`, {
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
        if (error) {
            console.log("error");
            console.log(error);
        }
    }
};

const filterPrograms = async (authToken,formValues) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/provider-programs/filter`,
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

const enrollPatientInProgram = async (authToken,formValues,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/program/enroll`,
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
        if (error.response && error.response.status === 401) {

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
            // console.log("error.response");
            // console.log(error.response);
        }
        throw error;
    }
};





export default {
    fetchPrograms,
    saveProgram,
    deleteProgram,
    filterPrograms,
    fetchProgramPatients,
    enrollPatientInProgram
};
