import { useAuth } from '@/contexts/AuthContext';

export function useApi() {
    const { token, logout } = useAuth();
    const API_SRC = process.env.NEXT_PUBLIC_API_SRC;

    const apiCall = async (endpoint: string, options: RequestInit = {}) => {
        const url = `${API_SRC}${endpoint}`;
        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }

        const response = await fetch(url, config);

        if (response.status === 401) {
            logout();
            throw new Error('Authentication failed');
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API call failed');
        }

        return response;
    };

    return { apiCall };
}