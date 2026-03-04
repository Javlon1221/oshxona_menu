//useOrders.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../index.jsx';

// Get all orders
export const useGetOrders = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const response = await api.get('/orders');
            return response.data;
        }
    });
};

// Get single order
export const useGetOrder = (id) => {
    return useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            const response = await api.get(`/orders/${id}`);
            return response.data;
        },
        enabled: !!id
    });
};

// Create order
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (orderData) => {
            const response = await api.post('/orders', orderData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
    });
};

// Update order status
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, holat }) => {
            // Backend expects body field named "holat"
            const response = await api.put(`/orders/${id}/status`, { holat });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', data.id] });
        }
    });
};

// Delete order
export const useDeleteOrder = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(`/orders/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
    });
};



