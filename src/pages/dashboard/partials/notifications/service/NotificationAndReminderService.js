import {BASE_URL} from '../../../../../config';
import axios from "axios";
import Cookies from "js-cookie";
const fetchReminders = async (authToken,order,status) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/reminders?order=${order}&status=${status}`, {
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


const saveReminder = async (authToken,formValues,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');

        const response = await axios.post(
            `${BASE_URL}/reminders`,
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
                const activity = "Create Reminder.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            else {
                const activity = "Update Reminder.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            return response;
        }
    } catch (error) {
        if (error.response) {
            console.log("error.response");
            console.log(error.response);
        }
        throw error;
    }
};

const filterReminders = async (authToken,formValues) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/reminders/filter`,
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
        if (error.response && error.response.status === 401) {

        }
        throw error;
    }
};

const fetchProviderReminders = async (authToken,order,status,providerOrganizationID) => {
    try {
        const response = await fetch(`${BASE_URL}/provider-reminders?order=${order}&status=${status}&organizationId=${providerOrganizationID}`, {
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

const saveProviderReminder = async (authToken,formValues,loginUser) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/provider-reminders`,
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
                const activity = "Create Reminder.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            else {
                const activity = "Update Reminder.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            return response;
        }
    } catch (error) {
        if (error.response) {
            console.log("error.response");
            console.log(error.response);
        }
        throw error;
    }
};

const filterProviderReminders = async (authToken,formValues) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/provider-reminders/filter`,
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

const approveReminder = async (authToken,formValues,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');

        const response = await axios.post(
            `${BASE_URL}/reminders/approve`,
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
            if (response.data.Operation === 'APPROVE'){
                const activity = "Approve Reminder.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            return response;
        }
    } catch (error) {
        if (error.response) {
            console.log("error.response");
            console.log(error.response);
        }
        throw error;
    }
};
const approveProviderReminder = async (authToken,formValues,loginUser) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/provider-reminders/approve`,
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
            if (response.data.Operation === 'APPROVE'){
                const activity = "Approve Reminder.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            return response;
        }
    } catch (error) {
        if (error.response) {
            console.log("error.response");
            console.log(error.response);
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
            console.log("response");
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
    fetchReminders,
    saveReminder,
    filterReminders,
    fetchProviderReminders,
    saveProviderReminder,
    filterProviderReminders,
    approveReminder,
    approveProviderReminder
};
