import { BASE_URL } from '../../../../config';
import axios from "axios";
import Cookies from "js-cookie";

const fetchLogs = async (authToken,navigate) => {
    try {
        const response = await fetch(`${BASE_URL}/audit-log`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            const result = await response.json();
            return result.auditLogs;
        }
    } catch (error) {
        throw error;    }
};



export default {
    fetchLogs,
};
