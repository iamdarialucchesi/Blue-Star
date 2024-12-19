import {BASE_URL} from '../../../../config';
import axios from "axios";
import Cookies from "js-cookie";
const fetchDashboardItems = async (authToken,organizationId,navigate) => {
    try {
        const response = await fetch(`${BASE_URL}/provider-dashboard?OrganizationID=${organizationId}`, {
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
        if (error.response && (error.response.status === 401)) {
            console.log(error.response);
            Cookies.remove('authToken');
            Cookies.remove('Session');
            Cookies.remove('AccessToken');
            navigate('/login');
        }
    }
};

const fetchOrganizationWhiteLabels = async (authToken,UserID,organizationId) => {
    try {
        const response = await fetch(`${BASE_URL}/white-label/id?id=${organizationId}&UserID=${UserID}`, {
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
        if (error.response && (error.response.status === 401)) {
            console.log(error.response);
            Cookies.remove('authToken');
            Cookies.remove('Session');
            Cookies.remove('AccessToken');
        }
    }
};



export default {
    fetchDashboardItems,
    fetchOrganizationWhiteLabels
};
