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
        <div className="min-h-screen bg-[color:var(--brand-bg)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-[color:var(--brand-primary)] rounded-lg flex items-center justify-center shadow-lg ring-1 ring-black/10">
                        <span className="text-white font-bold text-2xl">🍽️</span>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-[color:var(--brand-primary)]">
                    Yangi hisob yarating
                </h2>
                <p className="mt-2 text-center text-sm text-black/60">
                    Yoki{' '}
                    <Link to="/login" className="font-medium text-[color:var(--brand-accent)] hover:opacity-90">
                        hisobingizga kiring
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/80 backdrop-blur py-8 px-4 shadow-2xl border border-black/10 sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="ism" className="block text-sm font-medium text-black/70">
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
                                    className="appearance-none block w-full px-3 py-2 border border-black/15 bg-white text-[color:var(--brand-text)] rounded-md placeholder-black/40 focus:outline-none focus:ring-[color:var(--brand-accent)]/25 focus:border-[color:var(--brand-accent)]"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="telefon" className="block text-sm font-medium text-black/70">
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
                                    className="appearance-none block w-full px-3 py-2 border border-black/15 bg-white text-[color:var(--brand-text)] rounded-md placeholder-black/40 focus:outline-none focus:ring-[color:var(--brand-accent)]/25 focus:border-[color:var(--brand-accent)]"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="manzil" className="block text-sm font-medium text-black/70">
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
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Parolni kiriting (kamida 5 ta belgi)"
                                    className="appearance-none block w-full px-3 py-2 border border-black/15 bg-white text-[color:var(--brand-text)] rounded-md placeholder-black/40 focus:outline-none focus:ring-[color:var(--brand-accent)]/25 focus:border-[color:var(--brand-accent)]"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black/70">
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
                                    className="appearance-none block w-full px-3 py-2 border border-black/15 bg-white text-[color:var(--brand-text)] rounded-md placeholder-black/40 focus:outline-none focus:ring-[color:var(--brand-accent)]/25 focus:border-[color:var(--brand-accent)]"
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
                                <div className="w-full border-t border-black/10" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[color:var(--brand-bg)] text-black/50">Yoki</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="w-full flex justify-center py-2 px-4 border border-black/10 rounded-md shadow-sm text-sm font-medium text-[color:var(--brand-primary)] bg-white hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[color:var(--brand-bg)] focus:ring-[color:var(--brand-accent)]/40"
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





