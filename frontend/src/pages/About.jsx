import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Biz haqimizda
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Oshxonamiz 2010-yildan beri mijozlarimizga eng mazali va sifati yuqori taomlarni taqdim etib kelmoqda.
                    </p>
                </div>

                {/* Story Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Bizning hikoyamiz
                        </h2>
                        <div className="space-y-4 text-gray-600">
                            <p>
                                Oshxonamiz 2010-yilda kichik oilaviy biznes sifatida boshlangan. 
                                O'sha paytda bizning maqsadimiz an'anaviy o'zbek taomlarini 
                                eng yaxshi masalliqlar bilan tayyorlash edi.
                            </p>
                            <p>
                                Yillar davomida bizning oshxonamiz kengayib, yangi taomlar qo'shildi 
                                va xizmat sifatimiz yanada yaxshilandi. Bugun biz 1000 dan ortiq 
                                muntazam mijozlarga xizmat ko'rsatamiz.
                            </p>
                            <p>
                                Bizning asosiy prinsiplarimiz: sifat, tezlik va mijozlar bilan 
                                do'stona munosabat. Har bir taom maxsus e'tibor bilan tayyorlanadi 
                                va faqat eng yaxshi masalliqlar ishlatiladi.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                            alt="Oshxona interyeri"
                            className="w-full h-96 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Bizning qadriyatlarimiz
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Yuqori sifat</h3>
                            <p className="text-gray-600">
                                Faqat eng yaxshi masalliqlar va an'anaviy retseptlar
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Tezkor xizmat</h3>
                            <p className="text-gray-600">
                                Buyurtmalaringizni tez va sifatli tayyorlash
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Mijozlar sevgisi</h3>
                            <p className="text-gray-600">
                                Har bir mijoz bizning oila a'zosi
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Bizning jamoa
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Akmal Oshpaz',
                                position: 'Bosh oshpaz',
                                description: '15 yillik tajribaga ega, an\'anaviy taomlar ustasi'
                            },
                            {
                                name: 'Dilnoza Menejer',
                                position: 'Menejer',
                                description: 'Mijozlar bilan ishlash bo\'yicha mutaxassis'
                            },
                            {
                                name: 'Jasur Yetkazuvchi',
                                position: 'Yetkazib berish',
                                description: 'Tezkor va xavfsiz yetkazib berish xizmati'
                            }
                        ].map((member, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white font-bold text-2xl">
                                        {member.name.charAt(0)}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-orange-500 font-medium mb-2">
                                    {member.position}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    {member.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-orange-500 rounded-lg p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-8">Bizning yutuqlarimiz</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-4xl font-bold mb-2">14+</div>
                            <div className="text-orange-100">Yillik tajriba</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">1000+</div>
                            <div className="text-orange-100">Muntazam mijozlar</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">50+</div>
                            <div className="text-orange-100">Turli taomlar</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-orange-100">Xizmat ko'rsatish</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;





