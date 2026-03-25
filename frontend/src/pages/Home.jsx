import React from 'react';
import { Link } from 'react-router-dom';
import { useGetRecipes } from '../api/hooks/useRecipe';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
    const { data: recipes, isLoading, error } = useGetRecipes();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-[color:var(--brand-bg)] py-16 md:py-24 lg:py-32 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-24 h-24 bg-[color:var(--brand-accent)] opacity-10 rounded-full animate-float"></div>
                    <div className="absolute top-32 right-20 w-16 h-16 bg-[color:var(--brand-secondary)] opacity-10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-[color:var(--brand-primary)] opacity-10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center animate-fade-in">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 animate-slide-up text-[color:var(--brand-primary)]">
                            Oshxonamizga Xush Kelibsiz
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-black/70 max-w-4xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
                            Eng mazali va sifati yuqori taomlar bilan sizni kutamiz
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.4s'}}>
                            <Link
                                to="/menu"
                                className="bg-[color:var(--brand-accent)] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-[#F25F2F] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                Menyuni ko'rish
                            </Link>
                            <Link
                                to="/about"
                                className="border border-black/15 text-[color:var(--brand-primary)] px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-black/5 transition-all duration-300 transform hover:scale-105"
                            >
                                Biz haqimizda
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 md:py-16 lg:py-20 bg-[color:var(--brand-bg)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 md:mb-12 animate-fade-in">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[color:var(--brand-primary)] mb-4 animate-slide-up">
                            Nima uchun bizni tanlash kerak?
                        </h2>
                        <p className="text-base sm:text-lg text-black/70 animate-slide-up" style={{animationDelay: '0.2s'}}>
                            Bizning oshxonamizning afzalliklari
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        <div className="text-center bg-white/80 backdrop-blur p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-slide-up border border-black/10" style={{animationDelay: '0.1s'}}>
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-[color:var(--brand-accent)] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in shadow-lg">
                                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2">Tezkor xizmat</h3>
                            <p className="text-sm md:text-base text-black/70">
                                Bizning taomlarimiz tez va sifatli tayyorlanadi
                            </p>
                        </div>
                        
                        <div className="text-center bg-white/80 backdrop-blur p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-slide-up border border-black/10" style={{animationDelay: '0.2s'}}>
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-[color:var(--brand-secondary)] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in shadow-lg">
                                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2">Yuqori sifat</h3>
                            <p className="text-sm md:text-base text-black/70">
                                Faqat eng yaxshi masalliqlar va an'anaviy retseptlar
                            </p>
                        </div>
                        
                        <div className="text-center bg-white/80 backdrop-blur p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-slide-up sm:col-span-2 lg:col-span-1 border border-black/10" style={{animationDelay: '0.3s'}}>
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-[color:var(--brand-primary)] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in shadow-lg">
                                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2">Yetkazib berish</h3>
                            <p className="text-sm md:text-base text-black/70">
                                Uyingizga tezkor va xavfsiz yetkazib berish
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Dishes Section */}
            <section className="py-12 md:py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 md:mb-12 animate-fade-in">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[color:var(--brand-primary)] mb-4 animate-slide-up">
                            Mashhur taomlar
                        </h2>
                        <p className="text-base sm:text-lg text-black/70 animate-slide-up" style={{animationDelay: '0.2s'}}>
                            Mijozlarimizning eng yaxshi ko'rgan taomlari
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12 animate-fade-in">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 animate-fade-in">
                            <p className="text-red-500 text-lg">Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {recipes?.slice(0, 6).map((recipe, index) => (
                                <div key={recipe.id} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                                    <RecipeCard recipe={recipe} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-8 md:mt-12 animate-fade-in" style={{animationDelay: '0.6s'}}>
                        <Link
                            to="/menu"
                            className="bg-[color:var(--brand-accent)] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-[#F25F2F] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                            Barcha taomlarni ko'rish
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-[color:var(--brand-primary)] text-white py-12 md:py-16 lg:py-20 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse-slow"></div>
                    <div className="absolute bottom-20 right-20 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="animate-fade-in">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 animate-slide-up">
                            Hozir buyurtma bering
                        </h2>
                        <p className="text-lg sm:text-xl mb-6 md:mb-8 text-white/85 animate-slide-up" style={{animationDelay: '0.2s'}}>
                            Bizning mazali taomlarimizni tatib ko'ring
                        </p>
                        <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
                            <Link
                                to="/menu"
                                className="bg-[color:var(--brand-accent)] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-[#F25F2F] transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-pulse-slow"
                            >
                                Buyurtma berish
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
