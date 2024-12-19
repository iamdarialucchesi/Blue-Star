import { BASE_URL } from '../../../../config';
import axios from "axios";
import Cookies from "js-cookie";
const fetchAllRoles = async (authToken) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/roles`, {
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

const saveRole = async (authToken,formValues,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/roles`,
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
                const activity = "Create Role.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            else {
                const activity = "Update Role.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            return response;
        }
    } catch (error) {
        throw error;
    }
};

const deleteRole = async (authToken, formValues, loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.delete(`${BASE_URL}/roles`, {
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
                'Access-Token': `${storedTokens}`
            },
            data: formValues
        });

        if (response.status === 200) {
            const activity = "Delete Role.";
            await saveAuditLog(authToken, loginUser, activity);
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
            // console.log(response);
        }
    } catch (error) {
        throw error;
    }
};

export default {
    fetchAllRoles,
    saveRole,
    deleteRole
};
