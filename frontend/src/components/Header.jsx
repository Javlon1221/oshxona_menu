import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/features/authSlice';
import { ShoppingCart, Menu, X, User, LogOut, Shield, ChefHat } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalQuantity = 0 } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const firstLinkRef = useRef(null);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  }, [dispatch, navigate]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      document.addEventListener('keydown', onKey);
      setTimeout(() => firstLinkRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Bosh sahifa', icon: '🏠' },
    { to: '/menu', label: 'Menyu', icon: '📋' },
    { to: '/about', label: 'Biz haqimizda', icon: 'ℹ️' },
    { to: '/contact', label: 'Aloqa', icon: '📞' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-[color:var(--brand-bg)]/90 backdrop-blur-md shadow-lg border-b border-black/10' 
            : 'bg-[color:var(--brand-bg)] shadow-md border-b border-black/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 md:space-x-3 group" 
              aria-label="Oshxona bosh sahifa"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[color:var(--brand-accent)] rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative w-10 h-10 md:w-12 md:h-12 bg-[color:var(--brand-primary)] rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg ring-1 ring-black/10">
                  <ChefHat className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold text-[color:var(--brand-primary)] group-hover:text-[#5A3F36] transition-colors duration-300">
                  Oshxona
                </span>
                <span className="text-[10px] md:text-xs text-black/60 font-medium -mt-1">
                  Mazali taomlar
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Asosiy navigatsiya">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm lg:text-base transition-all duration-300 ${
                      isActive
                        ? 'bg-[color:var(--brand-accent)] text-white shadow-md scale-105'
                        : 'text-[color:var(--brand-text)] hover:bg-black/5 hover:text-[color:var(--brand-primary)]'
                    }`
                  }
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-[color:var(--brand-text)] hover:text-[color:var(--brand-accent)] transition-all duration-300 hover:scale-110 group"
                aria-label="Savatcha"
              >
                <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[color:var(--brand-accent)] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                    {totalQuantity}
                  </span>
                )}
              </Link>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-[color:var(--brand-text)] hover:bg-black/5 hover:text-[color:var(--brand-primary)] transition-all duration-300 group"
                    >
                      <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{user?.ism || 'Profil'}</span>
                    </Link>

                    {user?.username === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                      >
                        <Shield className="w-5 h-5" />
                        <span className="font-medium">Admin</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-[color:var(--brand-text)] hover:bg-red-50 hover:text-red-700 transition-all duration-300 group"
                      type="button"
                    >
                      <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Chiqish</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-2 rounded-lg text-[color:var(--brand-text)] hover:bg-black/5 hover:text-[color:var(--brand-primary)] transition-all duration-300 font-medium"
                    >
                      Kirish
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-2 rounded-lg bg-[color:var(--brand-accent)] text-white hover:bg-[#F25F2F] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 font-medium"
                    >
                      Ro'yxatdan o'tish
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen((s) => !s)}
                className="md:hidden p-2 text-[color:var(--brand-text)] hover:text-[color:var(--brand-accent)] transition-all duration-300 hover:scale-110"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? 'Menyuni yoping' : 'Menyuni oching'}
                type="button"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <aside
        id="mobile-menu"
        ref={menuRef}
        className={`fixed top-0 right-0 w-[85%] max-w-sm h-full bg-[color:var(--brand-bg)] z-50 md:hidden shadow-2xl transform transition-all duration-300 ease-out border-l border-black/10 ${
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        aria-hidden={!isMenuOpen}
        aria-label="Mobil navigatsiya menyusi"
      >
        <div className="px-6 py-8 flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[color:var(--brand-primary)] rounded-lg flex items-center justify-center shadow-lg ring-1 ring-black/10">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[color:var(--brand-primary)]">
                Menyu
              </span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-black/60 hover:text-[color:var(--brand-accent)] transition-colors"
              aria-label="Yopish"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="flex flex-col space-y-2">
            {navLinks.map((link, idx) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-[color:var(--brand-text)] hover:bg-black/5 hover:text-[color:var(--brand-primary)] hover:shadow-md transition-all duration-300 font-medium group"
                onClick={() => setIsMenuOpen(false)}
                ref={idx === 0 ? firstLinkRef : null}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Footer (Auth) */}
          <div className="mt-auto pt-6 border-t border-black/10">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-black/5 text-[color:var(--brand-text)] hover:text-[color:var(--brand-primary)] hover:shadow-md transition-all duration-300 font-medium group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{user?.ism || 'Profil'}</span>
                </Link>

                {user?.username === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 hover:shadow-md transition-all duration-300 font-medium group"
                  type="button"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Chiqish</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-xl bg-black/5 text-[color:var(--brand-text)] hover:text-[color:var(--brand-primary)] hover:shadow-md transition-all duration-300 font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 rounded-xl bg-[color:var(--brand-accent)] text-white hover:bg-[#F25F2F] transition-all duration-300 shadow-md hover:shadow-lg font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Header;