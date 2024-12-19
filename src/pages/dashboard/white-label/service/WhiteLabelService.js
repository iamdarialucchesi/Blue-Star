import {BASE_URL} from '../../../../config';
import axios from "axios";
import Cookies from "js-cookie";
const fetchWhiteLabels = async (authToken) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/white-label`, {
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


const saveWhiteLabel = async (authToken,formValues,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/white-label`,
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
                const activity = "Create White Label.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            else {
                const activity = "Update White Label.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            return response;
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
            console.log("response");
        }
    } catch (error) {
        throw error;
    }
};


export default {
    fetchWhiteLabels,
    saveWhiteLabel,
};
