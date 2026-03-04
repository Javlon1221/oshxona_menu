import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../index.jsx';

// User registration
export const useUserRegister = () => {
    return useMutation({
        mutationFn: async (userData) => {
            try {
                const response = await api.post('/users/register', userData);
                return response.data;
            } catch (error) {
                if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
                    throw new Error('Backend server is not running. Please start the backend server first.');
                }
                throw error;
            }
        }
    });
};

// User login
export const useUserLogin = () => {
    return useMutation({
        mutationFn: async (credentials) => {
            try {
                const response = await api.post('/users/login', credentials);
                return response.data;
            } catch (error) {
                if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
                    throw new Error('Backend server is not running. Please start the backend server first.');
                }
                throw error;
            }
        },
        onSuccess: (data) => {
            // Persist token and user with explicit role for frontend checks
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ ...data.user, role: 'user' }));
        }
    });
};

// Get all users
export const useGetUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get('/users');
            return response.data;
        }
    });
};

// Get single user
export const useGetUser = (id) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            const response = await api.get(`/users/${id}`);
            return response.data;
        },
        enabled: !!id
    });
};

// Update user
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, ...userData }) => {
            const response = await api.put(`/users/${id}`, userData);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', data.id] });
        }
    });
};

// Delete user
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
};

// Get user orders
export const useGetUserOrders = (userId) => {
    return useQuery({
        queryKey: ['user-orders', userId],
        queryFn: async () => {
            const response = await api.get(`/users/${userId}/orders`);
            return response.data;
        },
        enabled: !!userId
    });
};

