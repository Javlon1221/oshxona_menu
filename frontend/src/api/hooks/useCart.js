import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../index.jsx';

// Get cart items
export const useGetCart = (userId) => {
    return useQuery({
        queryKey: ['cart', userId],
        queryFn: async () => {
            const response = await api.get(`/cart/${userId}`);
            return response.data;
        },
        enabled: !!userId
    });
};

// Add item to cart
export const useAddToCart = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ userId, recipeId, quantity }) => {
            const response = await api.post('/cart/add', { userId, recipeId, quantity });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['cart', data.userId] });
        }
    });
};

// Update cart item quantity
export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ userId, recipeId, quantity }) => {
            const response = await api.put('/cart/update', { userId, recipeId, quantity });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['cart', data.userId] });
        }
    });
};

// Remove item from cart
export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ userId, recipeId }) => {
            const response = await api.delete('/cart/remove', { data: { userId, recipeId } });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['cart', data.userId] });
        }
    });
};

// Clear cart
export const useClearCart = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (userId) => {
            const response = await api.delete(`/cart/clear/${userId}`);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['cart', data.userId] });
        }
    });
};



