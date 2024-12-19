import {BASE_URL} from '../../../../config';
import axios from "axios";
import Cookies from "js-cookie";


const fetchRoleAccessAbilities = async (authToken,UserId,navigate) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await fetch(`${BASE_URL}/roles-accessability?UserId=${UserId}`, {
            method: 'GET',
            headers: {
                Authorization: `${authToken}`,
                'Content-Type': 'application/json',
                'Access-Token': `${storedTokens}`
            },
        });

        if (response.status === 200) {
            const result = await response.json();
            return result.rolesAccessAbilities;
        }
    } catch (error) {
        throw error;
    }
};

const updateRoleAccessAbility = async (authToken,formValues) => {
    try {
        const storedTokens = await Cookies.get('AccessToken');
        const response = await axios.post(
            `${BASE_URL}/roles-accessability`,
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
            return response;
        }
    } catch (error) {
        throw error;
    }
};


export default {
    fetchRoleAccessAbilities,
    updateRoleAccessAbility
};
