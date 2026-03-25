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
    <nav className="fixed bottom-0 left-0 right-0 bg-[color:var(--brand-bg)]/95 backdrop-blur border-t border-black/10 shadow-lg z-50 md:hidden">
      <ul className="flex justify-around items-center py-2">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              aria-label={link.label}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center text-[11px] sm:text-xs font-medium transition-all duration-300 ${
                  isActive ? "text-[color:var(--brand-accent)] scale-105" : "text-black/60 hover:text-[color:var(--brand-primary)]"
                }`
              }
            >
              <div className="relative flex items-center justify-center">
                {React.createElement(link.icon, { className: "w-5 h-5 mb-0.5" })}
                {link.to === "/cart" && totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[color:var(--brand-accent)] text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
                    {totalQuantity}
                  </span>
                )}
              </div>
              <span className="leading-tight">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavbarBottom;
