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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">🍽️</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Hisobingizga kiring
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Yoki{' '}
          <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
            yangi hisob yarating
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
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
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Foydalanuvchi</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  checked={formData.isAdmin}
                  onChange={() => setFormData(prev => ({ ...prev, isAdmin: true, username: '', password: '' }))}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Admin</span>
              </label>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
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
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Yoki</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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
