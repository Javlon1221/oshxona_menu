import React, { useState, useEffect } from 'react';
import { useGetRecipes } from '../api/hooks/useRecipe';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

const Menu = () => {
    const { data: recipes, isLoading, error } = useGetRecipes();
    const [searchTerm, setSearchTerm] = useState('');
    const [
        filteredRecipes, setFilteredRecipes] = useState([]);
    const [priceFilter, setPriceFilter] = useState({ min: 0, max: 100000 });

    useEffect(() => {
        if (recipes) {
            let filtered = recipes;

            // Search filter
            if (searchTerm) {
                filtered = filtered.filter(recipe =>
                    recipe.ovqat_nomi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    recipe.masalliqlar.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Price filter
            filtered = filtered.filter(recipe =>
                recipe.narxi >= priceFilter.min && recipe.narxi <= priceFilter.max
            );

            setFilteredRecipes(filtered);
        }
    }, [recipes, searchTerm, priceFilter]);

    const clearFilters = () => {
        setSearchTerm('');
        setPriceFilter({ min: 0, max: 100000 });
    };

    return (
        <div className="min-h-screen bg-[color:var(--brand-bg)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8 animate-fade-in">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[color:var(--brand-primary)] mb-4 animate-slide-up">
                        Bizning Menyu
                    </h1>
                    <p className="text-base sm:text-lg text-black/70 animate-slide-up" style={{animationDelay: '0.2s'}}>
                        Eng mazali va sifati yuqori taomlar
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur border border-black/10 rounded-2xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium text-black/70 mb-2">
                                Qidirish
                            </label>
                            <input
                                type="text"
                                placeholder="Taom nomi yoki masalliq..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-black/15 bg-white text-[color:var(--brand-text)] rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/25 focus:border-[color:var(--brand-accent)] transition-all duration-300"
                            />
                        </div>

                        {/* Price Range */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium text-black/70 mb-2">
                                Narx oralig'i (so'm)
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceFilter.min}
                                    onChange={(e) => setPriceFilter(prev => ({ ...prev, min: Number(e.target.value) }))}
                                    className="w-full px-3 py-2 border border-black/15 bg-white text-[color:var(--brand-text)] rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/25 focus:border-[color:var(--brand-accent)] transition-all duration-300"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceFilter.max}
                                    onChange={(e) => setPriceFilter(prev => ({ ...prev, max: Number(e.target.value) }))}
                                    className="w-full px-3 py-2 border border-black/15 bg-white text-[color:var(--brand-text)] rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/25 focus:border-[color:var(--brand-accent)] transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end sm:col-span-2 lg:col-span-1">
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="w-full"
                            >
                                Filtrlarni tozalash
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="mb-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
                    <p className="text-black/60 text-sm sm:text-base">
                        {filteredRecipes.length} ta taom topildi
                    </p>
                </div>

                {/* Menu Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-12 animate-fade-in">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 animate-fade-in">
                        <p className="text-red-500 text-base sm:text-lg">Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.</p>
                    </div>
                ) : filteredRecipes.length === 0 ? (
                    <div className="text-center py-12 animate-fade-in">
                        <div className="w-16 h-16 bg-white/80 border border-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5-1.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p className="text-black/60 text-base sm:text-lg">Hech qanday taom topilmadi.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredRecipes.map((recipe, index) => (
                            <div key={recipe.id} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                                <RecipeCard recipe={recipe} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
