import {api} from "../constants.js";

export const logoutApi = async () => {
    const response = await fetch(api + '/authentication/logout', {
        method: 'POST',
        credentials: 'include',
    });

    return response.ok;
}

export const loginApi = async (username, password) => {
    try {
        const response = await fetch(api + 'authentication/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const user = await response.json();
            return { success: true, user: user };
        } else {
            const errorBody = await response.json();
            const error = errorBody.error || 'Login failed';
            return { success: false, error: error };
        }
    } catch (error) {
        return { success: false, error: 'Failed to connect to server' };
    }
};

export const signUpApi = async (username, password) => {
    try {
        const response = await fetch(api + '/authentication/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const user = await response.json();
            return { success: true, user: user };
        } else {
            const errorBody = await response.json();
            const error = errorBody.error || 'Signup failed';
            return { success: false, error: error };
        }
    } catch (error) {
        return { success: false, error: 'Failed to connect to server' };
    }
};
