import {api} from "../constants.js";

export const getSessionsApi = async () => {
    try {
        const response = await fetch(api + '/sessions', {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();
        if (!response.ok) {
            const errorBody = data.error || 'Failed to retrieve sessions';
            console.error('Error: ', errorBody); 
            return { success: false, error: errorBody };
        }
        return { success: true, sessions: data };
    } catch (error) {
        console.error('Error: ', error);
        return { success: false, error: 'Failed to connect to server' };
    }
};

export const getSessionPlansApi = async (guid) => {
    try {
        const response = await fetch(api + '/session/' + guid + '/plans', {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();
        if (!response.ok) {
            const errorBody = data.error || 'Failed to retrieve plans';
            console.error('Error: ', errorBody);
            return { success: false, error: errorBody };
        }
        return { success: true, planData: data };
    } catch (error) {
        console.error('Error: ', error);
        return { success: false, error: 'Failed to connect to server' };
    }
};

export const createSessionApi = async () => {
    const currentDateTime = new Date().toLocaleString();

    try {
        const response = await fetch(api + '/session', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dateTime: currentDateTime }),
        });

        const data = await response.json();
        if (!response.ok) {
            const errorBody = data.error || 'Session creation failed';
            console.error('Error: ', errorBody);
            return { success: false, error: errorBody};
        }
        return { success: true, session: data };
    } catch (error) {
        console.error('Error: ', error);
        return { success: false, error: 'Failed to connect to server' };
    }
};

export const updateSessionApi = async (guid, updates) => {
    try {
        const response = await fetch(api + '/session' + guid, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });

        const data = await response.json();
        if (!response.ok) {
            const errorBody = data.error || 'Session update failed';
            console.error('Error: ', errorBody);
            return { success: false, error: errorBody };
        }
        return { success: true, session: data };
    } catch (error) {
        console.error('Error: ', error);
        return { success: false, error: 'Failed to connect to server' };
    }
};

export const cloneSessionApi = async (session) => {
    try {
        const response = await fetch(api + '/session/' + session.guid + '/clone', {
            method: 'POST',
            credentials: 'include',
        });

        const data = await response.json();
        if (!response.ok) {
            const errorBody = data.error || 'Session clone failed';
            console.error('Error: ', errorBody);
            return { success: false, error: errorBody };
        }
        return { success: true, session: data };
    } catch (error) {
        console.error('Error: ', error);
        return { success: false, error: 'Failed to connect to server' };
    }
};

export const deleteSessionApi = async (guid) => {
    try {
        const response = await fetch(api + '/session/' + guid, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorBody = await response.json();
            const error = errorBody.error || 'Session delete failed';
            console.error('Error: ', error);
            return { success: false, error: error };
        }
    } catch (error) {
        console.error('Error: ', error);
        return { success: false, error: 'Failed to connect to server' };
    }
};

export const addSessionPlanDefaultApi = async (guid) => {
    try {
        const response = await fetch(api + '/session/' + guid + '/plan', {
            method: 'POST',
            credentials: 'include',
        });

        const data = await response.json();
        if (!response.ok) {
            const errorBody = data.error || 'Plan add failed';
            console.error('Error: ', errorBody);
            return { success: false, error: errorBody };
        }
        return { success: true, plan: data };
    } catch (error) {
        console.error('Error: ', error);
        return { success: false, error: 'Failed to connect to server' };
    }
}
