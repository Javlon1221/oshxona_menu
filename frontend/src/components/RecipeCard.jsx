import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart, updateQuantity, removeFromCart } from "../redux/features/cartSlice";

const RecipeCard = ({ recipe }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const itemInCart = cartItems.find((item) => item.id === recipe.id);
  const quantity = itemInCart ? itemInCart.quantity : 0;

  const handleAddToCart = () => {
    dispatch(addToCart({ recipe, quantity: 1 }));
  };

  const handleIncrement = () => {
    dispatch(updateQuantity({ recipeId: recipe.id, quantity: quantity + 1 }));
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      dispatch(updateQuantity({ recipeId: recipe.id, quantity: quantity - 1 }));
    } else {
      dispatch(removeFromCart(recipe.id));
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col justify-between bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 w-full max-w-[340px] mx-auto"
    >
      {/* Rasm qismi */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <motion.img
          src={recipe.image_path}
          alt={recipe.ovqat_nomi}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              "https://static.vecteezy.com/system/resources/previews/009/291/628/original/restaurant-logo-design-vector.jpg";
          }}
        />
        <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md">
          {recipe.narxi?.toLocaleString()} so‘m
        </div>
      </div>

      {/* Ma'lumot qismi */}
      <div className="flex flex-col flex-grow p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 line-clamp-1 hover:text-orange-600 transition-colors">
          {recipe.ovqat_nomi}
        </h3>

        <div className="flex items-center text-gray-600 mb-1 text-sm">
          <svg
            className="w-4 h-4 mr-1 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {recipe.tayyorlanish_vaqti}
        </div>

        <p className="text-gray-600 text-sm mb-2 line-clamp-2 h-[40px]">
          {recipe.tavsif}
        </p>

        <p className="text-xs text-gray-500 line-clamp-2 h-[36px] mb-4">
          <span className="font-medium text-gray-700">Masalliqlar:</span> {recipe.masalliqlar}
        </p>

        {/* Savatcha tugmasi yoki counter */}
        <AnimatePresence mode="wait">
          {quantity === 0 ? (
            <motion.button
              key="add-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.3 }}
              onClick={handleAddToCart}
              className="mt-auto w-full bg-gradient-to-r from-orange-500 to-red-400 text-white py-2 rounded-xl font-semibold hover:scale-[1.02] active:scale-95 transition-all shadow-md"
            >
              Savatchaga qo‘shish
            </motion.button>
          ) : (
            <motion.div
              key="counter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.3 }}
              className="mt-auto flex items-center justify-between bg-gray-100 rounded-xl px-3 py-2"
            >
              <motion.button
                onClick={handleDecrement}
                whileTap={{ scale: 0.85 }}
                className="text-2xl font-bold text-gray-600"
              >
                −
              </motion.button>
              <motion.span
                key={quantity}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-lg font-semibold"
              >
                {quantity}
              </motion.span>
              <motion.button
                onClick={handleIncrement}
                whileTap={{ scale: 0.85 }}
                className="text-2xl font-bold text-gray-600"
              >
                +
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
