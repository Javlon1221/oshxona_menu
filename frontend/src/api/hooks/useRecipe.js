import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../index.jsx';

const buildRecipePayload = (recipeData) => {
    const hasFile =
        typeof File !== 'undefined' &&
        recipeData?.image_file instanceof File;

    if (!hasFile) {
        const { image_file, ...jsonPayload } = recipeData || {};
        return { data: jsonPayload, config: undefined };
    }

    const formData = new FormData();
    Object.entries(recipeData || {}).forEach(([key, value]) => {
        if (value == null || key === 'image_file') return;
        formData.append(key, String(value));
    });
    formData.append('image', recipeData.image_file);

    return {
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
    };
};

// Mock data for development
const mockRecipes = [
    {
        id: 1,
        ovqat_nomi: 'Osh',
        tayyorlanish_vaqti: '1 soat',
        masalliqlar: 'Go\'sht, sabzi, guruch, piyoz, ziravorlar',
        narxi: 25000,
        image_path: 'https://th.bing.com/th/id/OIP.iejSb9xLk-1y-WXQlzVjggHaE7?w=241&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3',
        tavsif: 'Milliy taom, to\'y va bayramlarda tayyorlanadi.',
        yaratilgan_vaqt: new Date().toISOString()
    },
    {
        id: 2,
        ovqat_nomi: 'Lagʻmon',
        tayyorlanish_vaqti: '45 daqiqa',
        masalliqlar: 'Go\'sht, sabzi, bulg\'or qalampiri, lagʻmon xamiri, pomidor',
        narxi: 22000,
        image_path: 'https://th.bing.com/th/id/OIP.zkixWeAZa8WbCbcMy_qWXAHaFW?w=264&h=191&c=7&r=0&o=7&cb=12&pid=1.7&rm=3',
        tavsif: 'Xitoy taomidan ilhomlangan milliy sho\'rva.',
        yaratilgan_vaqt: new Date().toISOString()
    },
    {
        id: 3,
        ovqat_nomi: 'Mastava',
        tayyorlanish_vaqti: '40 daqiqa',
        masalliqlar: 'Guruch, go\'sht, sabzi, kartoshka, pomidor',
        narxi: 18000,
        image_path: 'https://th.bing.com/th/id/OIP.948e_IhSltC-0D8PAxZbyAHaE8?w=283&h=189&c=7&r=0&o=7&cb=12&pid=1.7&rm=3',
        tavsif: 'Suyuq taom, to\'yimli va vitaminlarga boy.',
        yaratilgan_vaqt: new Date().toISOString()
    },
    {
        id: 4,
        ovqat_nomi: 'Somsa',
        tayyorlanish_vaqti: '30 daqiqa',
        masalliqlar: 'Go\'sht, piyoz, xamir, tuz, ziravorlar',
        narxi: 12000,
        image_path: 'https://th.bing.com/th/id/OIP.lk13aL6fmKUXiFqrbDWn4QHaE7?w=278&h=185&c=7&r=0&o=7&cb=12&pid=1.7&rm=3',
        tavsif: 'Tandirda pishiriladigan milliy pirog.',
        yaratilgan_vaqt: new Date().toISOString()
    },
    {
        id: 5,
        ovqat_nomi: 'Shashlik',
        tayyorlanish_vaqti: '25 daqiqa',
        masalliqlar: 'Mol go\'shti, piyoz, tuz, ziravorlar',
        narxi: 20000,
        image_path: 'https://th.bing.com/th/id/OIP.a-b-cFBSZx-kCxsg33maGwHaFj?w=279&h=210&c=7&r=0&o=7&cb=12&pid=1.7&rm=3',
        tavsif: 'Ko\'mirda qovuriladigan mazali taom.',
        yaratilgan_vaqt: new Date().toISOString()
    }
];

// Get all recipes (ovqatlar)
export const useGetRecipes = () => {
    return useQuery({
        queryKey: ['recipes'],
        queryFn: async () => {
            try {
                const response = await api.get('/recipes');
                return response.data;
            } catch (error) {
                console.warn('Backend connection failed, using mock data:', error.message);
                // Return mock data if backend is not available
                return mockRecipes;
            }
        },
        retry: 1, // Only retry once
        retryDelay: 1000
    });
};

// Get single recipe
export const useGetRecipe = (id) => {
    return useQuery({
        queryKey: ['recipe', id],
        queryFn: async () => {
            const response = await api.get(`/recipes/${id}`);
            return response.data;
        },
        enabled: !!id
    });
};

// Create recipe
export const useCreateRecipe = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (recipeData) => {
            const { data, config } = buildRecipePayload(recipeData);
            const response = await api.post('/recipes', data, config);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        }
    });
};

// Update recipe
export const useUpdateRecipe = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, ...recipeData }) => {
            const { data, config } = buildRecipePayload(recipeData);
            const response = await api.put(`/recipes/${id}`, data, config);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            queryClient.invalidateQueries({ queryKey: ['recipe', data.id] });
        }
    });
};

// Delete recipe
export const useDeleteRecipe = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(`/recipes/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        }
    });
};
