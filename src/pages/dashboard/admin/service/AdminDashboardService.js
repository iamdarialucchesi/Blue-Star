import {BASE_URL} from '../../../../config';
import axios from "axios";
import Cookies from "js-cookie";

const fetchDashboardItems = async (authToken,navigate) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/dashboard-items`, {
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

const fetchPatientAndProgramCounts = async (authToken,startDate,endDate) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/dashboard-items/graph?startDate=${startDate}&endDate=${endDate}`, {
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




export default {
    fetchDashboardItems,
    fetchPatientAndProgramCounts
};
