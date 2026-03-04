import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Utensils, ShoppingCart, User } from "lucide-react";
import { useSelector } from "react-redux";

const NavbarBottom = () => {
  const { totalQuantity } = useSelector((state) => state.cart);

  const links = [
    { to: "/", label: "Bosh sahifa", icon: Home },
    { to: "/menu", label: "Menyu", icon: Utensils },
    { to: "/cart", label: "Savat", icon: ShoppingCart },
    { to: "/profile", label: "Profil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <ul className="flex justify-around items-center py-2">
        {links.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              aria-label={label}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center text-[11px] sm:text-xs font-medium transition-all duration-300 ${
                  isActive ? "text-orange-500 scale-105" : "text-gray-600 hover:text-orange-400"
                }`
              }
            >
              <div className="relative flex items-center justify-center">
                <Icon className="w-5 h-5 mb-0.5" />
                {to === "/cart" && totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
                    {totalQuantity}
                  </span>
                )}
              </div>
              <span className="leading-tight">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavbarBottom;
