import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserRegister } from '../api/hooks/useFoydalanuvchi';
import Button from '../components/Button';

const Register = () => {
    const [formData, setFormData] = useState({
        ism: '',
        telefon: '',
        password: '',
        confirmPassword: '',
        manzil: ''
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const registerMutation = useUserRegister();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Parollar mos kelmaydi');
            return;
        }

        if (formData.password.length < 5) {
            setError('Parol kamida 5 ta belgi bo\'lishi kerak');
            return;
        }

        try {
            await registerMutation.mutateAsync({
                ism: formData.ism,
                telefon: formData.telefon,
                password: formData.password,
                manzil: formData.manzil
            });
            
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">🍽️</span>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Yangi hisob yarating
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Yoki{' '}
                    <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                        hisobingizga kiring
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="ism" className="block text-sm font-medium text-gray-700">
                                Ism va familiya
                            </label>
                            <div className="mt-1">
                                <input
                                    id="ism"
                                    name="ism"
                                    type="text"
                                    required
                                    value={formData.ism}
                                    onChange={handleChange}
                                    placeholder="Ism va familiyangizni kiriting"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="telefon" className="block text-sm font-medium text-gray-700">
                                Telefon raqam
                            </label>
                            <div className="mt-1">
                                <input
                                    id="telefon"
                                    name="telefon"
                                    type="tel"
                                    required
                                    value={formData.telefon}
                                    onChange={handleChange}
                                    placeholder="+998901234567"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="manzil" className="block text-sm font-medium text-gray-700">
                                Manzil
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="manzil"
                                    name="manzil"
                                    rows={3}
                                    value={formData.manzil}
                                    onChange={handleChange}
                                    placeholder="To'liq manzilingizni kiriting"
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
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Parolni kiriting (kamida 5 ta belgi)"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Parolni tasdiqlang
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Parolni qayta kiriting"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full"
                                loading={registerMutation.isPending}
                                disabled={registerMutation.isPending}
                            >
                                {registerMutation.isPending ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
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
                                to="/login"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Hisobingizga kiring
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;





