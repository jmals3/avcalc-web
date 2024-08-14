import {api} from "../constants.js";

export const deletePlanApi = async (guid) => {
    try {
        const response = await fetch(api + '/plan/' + guid, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorBody = await response.json();
            const error = errorBody.error || 'Plan delete failed';
            console.error('Error: ', error);
            return { success: false, error: error };
        }
    } catch (error) {
        console.error('Error: ', error);
        return { success: false, error: 'Failed to connect to server' };
    }
};
