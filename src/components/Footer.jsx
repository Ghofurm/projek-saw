import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const Footer = () => {
  return (
    <footer className="mt-auto bg-[#F7F6F0] border-t-4 border-black px-6 py-8 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Info Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 w-fit px-3 py-1 bg-neo-green border-3 border-black shadow-[3px_3px_0px_#000] font-black text-lg">
            <Icon icon="ph:storefront-bold" className="text-xl" />
            <span>Lookmanstore.id</span>
          </div>
          <p className="font-extrabold text-sm text-gray-700">
            SPK Pemilihan Produk Terlayak Promosi Marketplace menggunakan metode Simple Additive Weighting (SAW).
          </p>
        </div>

        {/* Links Column */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <h4 className="font-black text-base border-b-2 border-black pb-1 mb-1">Navigasi Cepat</h4>
          <div className="flex flex-wrap md:flex-col gap-2 justify-center md:justify-start">
            <Link to="/alternatif" className="font-extrabold text-sm text-gray-700 hover:text-neo-pink hover:underline">
              ✦ Data Alternatif
            </Link>
            <Link to="/kriteria" className="font-extrabold text-sm text-gray-700 hover:text-neo-orange hover:underline">
              ✦ Kriteria & Bobot
            </Link>
            <Link to="/kalkulator" className="font-extrabold text-sm text-gray-700 hover:text-neo-blue hover:underline">
              ✦ Kalkulator Perhitungan
            </Link>
            <Link to="/perangkingan" className="font-extrabold text-sm text-gray-700 hover:text-neo-yellow hover:underline">
              ✦ Hasil Perangkingan
            </Link>
          </div>
        </div>

        {/* Badge / Technical Specs Column */}
        <div className="flex flex-col gap-3 md:items-end">
          <div className="flex items-center gap-2 px-4 py-2 bg-neo-blue text-white border-3 border-black shadow-[3px_3px_0px_#000] font-bold text-xs w-fit">
            <Icon icon="logos:react" className="text-lg" />
            <span>Powered by React & Tailwind v4</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-neo-pink text-white border-3 border-black shadow-[3px_3px_0px_#000] font-bold text-xs w-fit">
            <Icon icon="ph:shield-check-bold" className="text-lg" />
            <span>Neobrutalism Concept UI</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t-3 border-black mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-black text-gray-600">
          &copy; {new Date().getFullYear()} Lookmanstore.id - SPK Promosi Marketplace.
        </p>
        <div className="flex gap-4">
          <a href="#" className="p-1.5 bg-white border-2 border-black hover:bg-neo-yellow hover:translate-y-[-2px] transition-all">
            <Icon icon="ph:github-logo-bold" className="text-lg" />
          </a>
          <a href="#" className="p-1.5 bg-white border-2 border-black hover:bg-neo-blue hover:translate-y-[-2px] transition-all">
            <Icon icon="ph:linkedin-logo-bold" className="text-lg" />
          </a>
          <a href="#" className="p-1.5 bg-white border-2 border-black hover:bg-neo-pink hover:translate-y-[-2px] transition-all">
            <Icon icon="ph:globe-bold" className="text-lg" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
