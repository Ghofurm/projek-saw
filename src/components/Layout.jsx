import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F0]">
      {/* Top Banner decoration */}
      <div className="bg-black text-white text-center py-1.5 font-bold text-xs tracking-wider border-b-2 border-black">
        ⚡ SPK LOOKMANSTORE.ID - MEMILIH PRODUK PALING LAYAK DIPROMOSIKAN DI MARKETPLACE ⚡
      </div>
      
      <Navbar />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 md:px-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
