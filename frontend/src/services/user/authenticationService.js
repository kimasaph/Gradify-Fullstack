import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_USER_SERVICE

export const signUpUser = async (formData) => {
    
    try{    
        const response = await axios.post(`${API_BASE_URL}/postuserrecord`, formData);
        return response.data;
    } catch (error){
        console.error('Error signing up:', error);
        throw error;
    }
}

export const updateUserRole = async (userId, role, header) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-role/${userId}`, { role }, {
        headers: {
            ...header,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

export const loginUser = async (credential) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            email: credential.email,
            password: credential.password,
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/request-password-reset`, { email });
        return response.data;
    } catch (error) {
        console.error('Error requesting password reset:', error);
        throw error;
    }
}

export const verifyResetCode = async (email, code) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/verify-reset-code`, { 
            email, 
            code 
        });
        return response.data;
    } catch (error) {
        console.error('Error verifying reset code:', error);
        throw error;
    }
}

export const resetPassword = async (credential) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reset-password`, {
            email: credential.email,
            resetToken: credential.resetToken,
            newPassword: credential.password,
        });
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
}

export const completeOnboarding = async (onboardingData, header) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/onboarding`, onboardingData, {
            headers: {
                ...header,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error completing onboarding:', error);
        throw error;
    }
}

export const googleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

export const microsoftLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/microsoft";
};