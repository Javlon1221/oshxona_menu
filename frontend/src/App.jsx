import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MainRoutes from './pages/index';
import NavbarBottom from './components/NavbarBottom';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
        <main className="flex-grow">
          <MainRoutes />
        </main>
      <Footer />
      <NavbarBottom />
    </div>
  );
};

export default App;