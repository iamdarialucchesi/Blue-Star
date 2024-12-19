import {BASE_URL} from '../../../../config';
import axios from "axios";
import Cookies from "js-cookie";
const fetchOrganizations = async (authToken,order,navigate) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/organization?order=${order}`, {
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
            console.log(error.response);
            // await Cookies.remove('authToken');
            // await Cookies.remove('AccessToken');
            // await Cookies.remove('loginUser');
            //
            // navigate('/login', {replace: true});
            // window.location.reload();
        }
    }
};


const addOrganization = async (authToken,formValues,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/organization`,
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
                const activity = "Create Organization.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            else {
                const activity = "Update Organization.";
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

const deleteOrganization = async (authToken,organizationId,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.delete(`${BASE_URL}/organization/id?id=${organizationId}`, {
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
                'Access-Token': `${storedTokens}`
            },
        });

        if (response.status === 200) {
            const activity = "Delete Organization.";
            await saveAuditLog(authToken,loginUser,activity);
            return response; // Assuming the API returns some data on successful deletion
        }
    } catch (error) {
        if (error.response) {
            console.log("error.response");
            console.log(error.response);
        }
        throw error;
    }
};

const fetchOrganizationUsers = async (authToken,OrganizationID,order) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/organization/users?OrganizationID=${OrganizationID}&order=${order}`, {
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
        if (error.response && error.response.status === 401) {

        }
    }
};

const addOrganizationUser = async (authToken,formValues,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/organization/users`,
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
                const activity = "Create Organization User.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            else {
                const activity = "Update Organization User.";
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

const deleteOrganizationUser = async (authToken,organizationId,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.delete(`${BASE_URL}/organization/users/id?id=${organizationId}`, {
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
                'Access-Token': `${storedTokens}`
            },
        });

        if (response.status === 200) {
            const activity = "Delete Organization User.";
            await saveAuditLog(authToken,loginUser,activity);
            return response; // Assuming the API returns some data on successful deletion
        }
    } catch (error) {
        if (error.response) {
            console.log("error.response");
            console.log(error.response);
        }
        throw error;
    }
};

const fetchOrganizationPractices = async (authToken,OrganizationID,order) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/organization/practices?OrganizationID=${OrganizationID}&order=${order}`, {
            method: 'GET',
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
                'Access-Token': `${storedTokens}`
            },
        });

        if (response.status === 200) {
            const result = await response.json();
            return result.organizationPractices;
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {

        }
    }
};

const addOrganizationPractice = async (authToken,formValues,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/organization/practices`,
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
                const activity = "Create Organization Practice.";
                await saveAuditLog(authToken,loginUser,activity);
            }
            else {
                const activity = "Update Organization Practice.";
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

const deleteOrganizationPractice = async (authToken,PracticeId,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.delete(`${BASE_URL}/organization/practices/id?id=${PracticeId}`, {
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
                'Access-Token': `${storedTokens}`
            },
        });

        if (response.status === 200) {
            const activity = "Delete Organization Practice.";
            await saveAuditLog(authToken,loginUser,activity);
            return response; // Assuming the API returns some data on successful deletion
        }
    } catch (error) {
        if (error.response) {
            console.log("error.response");
            console.log(error.response);
        }
        throw error;
    }
};

const changeOrganizationUserRole = async (authToken,formValues,loginUser) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/organization/users/role`,
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
            const activity = "Change Organization User Role.";
            await saveAuditLog(authToken,loginUser,activity);
            return response;
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {

        }
        throw error;
    }
}

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
        }
    } catch (error) {
        if (error.response) {
            console.log("error.response");
            console.log(error.response);
        }
        throw error;
    }
};

const filterOrganizationData = async (authToken, formValues) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/organization/filter`,
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
            return result.data;
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
    fetchOrganizations,
    addOrganization,
    deleteOrganization,
    fetchOrganizationUsers,
    addOrganizationUser,
    deleteOrganizationUser,
    fetchOrganizationPractices,
    addOrganizationPractice,
    deleteOrganizationPractice,
    changeOrganizationUserRole,
    filterOrganizationData
};
