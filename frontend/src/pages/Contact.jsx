import React, { useState } from 'react';
import Button from '../components/Button';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        console.log('Form submitted:', formData);
        alert('Xabaringiz yuborildi! Tez orada sizga javob beramiz.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    return (
        <div className="min-h-screen bg-[color:var(--brand-bg)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[color:var(--brand-primary)] mb-6">
                        Biz bilan bog'laning
                    </h1>
                    <p className="text-xl text-black/70 max-w-3xl mx-auto">
                        Savollaringiz yoki takliflaringiz bo'lsa, bizga yozing. 
                        Biz sizga tez orada javob beramiz.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white/80 backdrop-blur border border-black/10 rounded-2xl shadow-md p-8">
                        <h2 className="text-2xl font-bold text-[color:var(--brand-primary)] mb-6">
                            Xabar yuborish
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-black/70 mb-1">
                                        Ism va familiya
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-black/15 bg-white text-[color:var(--brand-text)] rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/25 focus:border-[color:var(--brand-accent)]"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-black/70 mb-1">
                                        Telefon raqam
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-black/15 bg-white text-[color:var(--brand-text)] rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/25 focus:border-[color:var(--brand-accent)]"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-black/70 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-black/15 bg-white text-[color:var(--brand-text)] rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/25 focus:border-[color:var(--brand-accent)]"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-black/70 mb-1">
                                    Xabar
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-black/15 bg-white text-[color:var(--brand-text)] rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/25 focus:border-[color:var(--brand-accent)]"
                                />
                            </div>
                            
                            <Button type="submit" className="w-full">
                                Xabar yuborish
                            </Button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        {/* Contact Details */}
                        <div className="bg-white/80 backdrop-blur border border-black/10 rounded-2xl shadow-md p-8">
                            <h2 className="text-2xl font-bold text-[color:var(--brand-primary)] mb-6">
                                Aloqa ma'lumotlari
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-[color:var(--brand-accent)] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[color:var(--brand-primary)]">Manzil</h3>
                                        <p className="text-black/70">
                                            Toshkent shahri, Yunusobod tumani,<br />
                                            Amir Temur shoh ko'chasi, 123-uy
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-[color:var(--brand-accent)] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[color:var(--brand-primary)]">Telefon</h3>
                                        <p className="text-black/70">
                                            +998 90 123 45 67<br />
                                            +998 71 234 56 78
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-[color:var(--brand-accent)] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[color:var(--brand-primary)]">Email</h3>
                                        <p className="text-black/70">
                                            info@oshxona.uz<br />
                                            support@oshxona.uz
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-[color:var(--brand-secondary)] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[color:var(--brand-primary)]">Ish vaqti</h3>
                                        <p className="text-black/70">
                                            Dushanba - Yakshanba: 09:00 - 23:00<br />
                                            Bayram kunlari: 10:00 - 22:00
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-white/80 backdrop-blur border border-black/10 rounded-2xl shadow-md p-8">
                            <h2 className="text-2xl font-bold text-[color:var(--brand-primary)] mb-4">
                                Bizning joylashuvimiz
                            </h2>
                            <div className="bg-white h-64 rounded-lg flex items-center justify-center border border-black/10">
                                <div className="text-center text-black/45">
                                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p>Xarita yuklanmoqda...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;





