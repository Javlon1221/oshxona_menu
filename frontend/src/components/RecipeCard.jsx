import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
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
    <Motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col justify-between bg-white/80 backdrop-blur rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 w-full max-w-[340px] mx-auto border border-black/10"
    >
      {/* Rasm qismi */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Motion.img
          src={recipe.image_path}
          alt={recipe.ovqat_nomi}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              "https://static.vecteezy.com/system/resources/previews/009/291/628/original/restaurant-logo-design-vector.jpg";
          }}
        />
        <div className="absolute top-2 right-2 bg-[color:var(--brand-accent)] text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md">
          {recipe.narxi?.toLocaleString()} so‘m
        </div>
      </div>

      {/* Ma'lumot qismi */}
      <div className="flex flex-col flex-grow p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-semibold text-[color:var(--brand-primary)] mb-1 line-clamp-1 hover:text-[#5A3F36] transition-colors">
          {recipe.ovqat_nomi}
        </h3>

        <div className="flex items-center text-black/60 mb-1 text-sm">
          <svg
            className="w-4 h-4 mr-1 text-[color:var(--brand-accent)]"
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

        <p className="text-black/70 text-sm mb-2 line-clamp-2 h-[40px]">
          {recipe.tavsif}
        </p>

        <p className="text-xs text-black/60 line-clamp-2 h-[36px] mb-4">
          <span className="font-medium text-black/80">Masalliqlar:</span> {recipe.masalliqlar}
        </p>

        {/* Savatcha tugmasi yoki counter */}
        <AnimatePresence mode="wait">
          {quantity === 0 ? (
            <Motion.button
              key="add-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.3 }}
              onClick={handleAddToCart}
              className="mt-auto w-full bg-[color:var(--brand-accent)] text-white py-2 rounded-xl font-semibold hover:bg-[#F25F2F] hover:scale-[1.02] active:scale-95 transition-all shadow-md"
            >
              Savatchaga qo‘shish
            </Motion.button>
          ) : (
            <Motion.div
              key="counter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.3 }}
              className="mt-auto flex items-center justify-between bg-[#6D4C41]/8 rounded-xl px-3 py-2 border border-black/10"
            >
              <Motion.button
                onClick={handleDecrement}
                whileTap={{ scale: 0.85 }}
                className="text-2xl font-bold text-[color:var(--brand-primary)] hover:text-[color:var(--brand-accent)] transition-colors"
              >
                −
              </Motion.button>
              <Motion.span
                key={quantity}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-lg font-semibold text-[color:var(--brand-text)]"
              >
                {quantity}
              </Motion.span>
              <Motion.button
                onClick={handleIncrement}
                whileTap={{ scale: 0.85 }}
                className="text-2xl font-bold text-[color:var(--brand-primary)] hover:text-[color:var(--brand-accent)] transition-colors"
              >
                +
              </Motion.button>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </Motion.div>
  );
};

export default RecipeCard;
