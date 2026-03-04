import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    recipes: [],
    selectedRecipe: null,
    loading: false,
    error: null,
    searchTerm: '',
    filters: {
        category: '',
        priceRange: { min: 0, max: 100000 },
        cookingTime: ''
    }
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setRecipes: (state, action) => {
            state.recipes = action.payload;
        },
        setSelectedRecipe: (state, action) => {
            state.selectedRecipe = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                category: '',
                priceRange: { min: 0, max: 100000 },
                cookingTime: ''
            };
            state.searchTerm = '';
        },
        addRecipe: (state, action) => {
            state.recipes.push(action.payload);
        },
        updateRecipe: (state, action) => {
            const index = state.recipes.findIndex(recipe => recipe.id === action.payload.id);
            if (index !== -1) {
                state.recipes[index] = action.payload;
            }
        },
        removeRecipe: (state, action) => {
            state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload);
        }
    }
});

export const { 
    setRecipes, 
    setSelectedRecipe, 
    setLoading, 
    setError, 
    clearError, 
    setSearchTerm, 
    setFilters, 
    clearFilters,
    addRecipe,
    updateRecipe,
    removeRecipe
} = menuSlice.actions;

export default menuSlice.reducer;





