import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalAmount: 0,
    totalQuantity: 0,
    loading: false,
    error: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { recipe, quantity = 1 } = action.payload;
            const existingItem = state.items.find(item => item.id === recipe.id);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ ...recipe, quantity });
            }
            
            cartSlice.caseReducers.calculateTotals(state);
        },
        removeFromCart: (state, action) => {
            const recipeId = action.payload;
            state.items = state.items.filter(item => item.id !== recipeId);
            cartSlice.caseReducers.calculateTotals(state);
        },
        updateQuantity: (state, action) => {
            const { recipeId, quantity } = action.payload;
            const item = state.items.find(item => item.id === recipeId);
            
            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(item => item.id !== recipeId);
                } else {
                    item.quantity = quantity;
                }
            }
            
            cartSlice.caseReducers.calculateTotals(state);
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.totalQuantity = 0;
        },
        calculateTotals: (state) => {
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.items.reduce((total, item) => total + (item.narxi * item.quantity), 0);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const { 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    setLoading, 
    setError, 
    clearError 
} = cartSlice.actions;

export default cartSlice.reducer;