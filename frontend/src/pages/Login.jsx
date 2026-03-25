import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useUserLogin } from '../api/hooks/useFoydalanuvchi';
import { useAdmin } from '../api/hooks/useAdmin';
import { loginSuccess } from '../redux/features/authSlice';
import Button from '../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    isAdmin: false
  });
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLoginMutation = useUserLogin();
  const adminLoginMutation = useAdmin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validatsiya
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Iltimos barcha maydonlarni to\'ldiring');
      return;
    }

    try {
      if (formData.isAdmin) {
        // Admin login: backend qaysi maydonni kutishini aniq bilmasak ham
        // username va telefon ikkalasini ham yuboramiz (agar kerak bo'lsa)
        const payload = {
          username: formData.username,
          telefon: formData.username, // ko'pincha admin ham telefon orqali login bo'lsa
          password: formData.password
        };

        const response = await adminLoginMutation.mutateAsync(payload);

        dispatch(loginSuccess({
          user: { ...response.admin, role: 'admin' },
          token: response.token
        }));

        navigate('/admin');
      } else {
        // Foydalanuvchi login (siz avval telefon yuborayotgan edingiz)
        const response = await userLoginMutation.mutateAsync({
          telefon: formData.username,
          password: formData.password
        });

        dispatch(loginSuccess({
          user: { ...response.user, role: 'user' },
          token: response.token
        }));

        navigate('/');
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        setError('Login yoki parol noto\'g\'ri');
      } else {
        console.error('Login error:', err);
        setError(err?.message || 'Kirishda xatolik yuz berdi');
      }
    }
  };

  const isLoading = userLoginMutation.isLoading || adminLoginMutation.isLoading;

  return (
    <div className="min-h-screen bg-[color:var(--brand-bg)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-[color:var(--brand-primary)] rounded-lg flex items-center justify-center shadow-lg ring-1 ring-black/10">
            <span className="text-white font-bold text-2xl">🍽️</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[color:var(--brand-primary)]">
          Hisobingizga kiring
        </h2>
        <p className="mt-2 text-center text-sm text-black/60">
          Yoki{' '}
          <Link to="/register" className="font-medium text-[color:var(--brand-accent)] hover:opacity-90">
            yangi hisob yarating
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur py-8 px-4 shadow-2xl border border-black/10 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  checked={!formData.isAdmin}
                  onChange={() => setFormData(prev => ({ ...prev, isAdmin: false, username: '', password: '' }))}
                  className="h-4 w-4 text-[color:var(--brand-accent)] focus:ring-[color:var(--brand-accent)] border-black/20 bg-white"
                />
                <span className="ml-2 text-sm text-black/80">Foydalanuvchi</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  checked={formData.isAdmin}
                  onChange={() => setFormData(prev => ({ ...prev, isAdmin: true, username: '', password: '' }))}
                  className="h-4 w-4 text-[color:var(--brand-accent)] focus:ring-[color:var(--brand-accent)] border-black/20 bg-white"
                />
                <span className="ml-2 text-sm text-black/80">Admin</span>
              </label>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-black/70">
                {formData.isAdmin ? 'Username yoki Telefon' : 'Telefon raqam'}
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete={formData.isAdmin ? 'username' : 'tel'}
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={formData.isAdmin ? 'Username yoki +998901234567' : '+998901234567'}
                  className="appearance-none block w-full px-3 py-2 border border-black/15 bg-white text-[color:var(--brand-text)] rounded-md placeholder-black/40 focus:outline-none focus:ring-[color:var(--brand-accent)]/25 focus:border-[color:var(--brand-accent)]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black/70">
                Parol
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Parolni kiriting"
                  className="appearance-none block w-full px-3 py-2 border border-black/15 bg-white text-[color:var(--brand-text)] rounded-md placeholder-black/40 focus:outline-none focus:ring-[color:var(--brand-accent)]/25 focus:border-[color:var(--brand-accent)]"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Kirilmoqda...' : 'Kirish'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[color:var(--brand-bg)] text-black/50">Yoki</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-2 px-4 border border-black/10 rounded-md shadow-sm text-sm font-medium text-[color:var(--brand-primary)] bg-white hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[color:var(--brand-bg)] focus:ring-[color:var(--brand-accent)]/40"
              >
                Ro'yxatdan o'tish
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
