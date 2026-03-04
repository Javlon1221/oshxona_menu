import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import menuReducer from "./features/menuSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    menu: menuReducer,
  },
});
