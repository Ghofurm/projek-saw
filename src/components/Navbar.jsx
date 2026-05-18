import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: 'ph:house-bold', activeColor: 'bg-neo-yellow' },
    { name: 'Alternatif', path: '/alternatif', icon: 'ph:users-three-bold', activeColor: 'bg-neo-orange' },
    { name: 'Kriteria & Bobot', path: '/kriteria', icon: 'ph:sliders-horizontal-bold', activeColor: 'bg-neo-green' },
    { name: 'Kalkulator SAW', path: '/kalkulator', icon: 'ph:calculator-bold', activeColor: 'bg-neo-blue' },
    { name: 'Perangkingan', path: '/perangkingan', icon: 'ph:trophy-bold', activeColor: 'bg-neo-pink' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#F7F6F0] border-b-4 border-black px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <NavLink 
          to="/" 
          className="flex items-center gap-2 px-3 py-1 bg-neo-yellow border-3 border-black shadow-[3px_3px_0px_#000] font-black text-xl hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#000] transition-all"
        >
          <Icon icon="ph:cpu-bold" className="text-2xl" />
          <span>SPK - SAW</span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-2 px-4 py-2 border-3 border-black font-extrabold text-sm transition-all neo-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] ${
                  isActive ? `${item.activeColor} translate-x-[-1px] translate-y-[-1px] shadow-[3px_3px_0px_#000]` : 'bg-white hover:bg-gray-50'
                }`
              }
            >
              <Icon icon={item.icon} className="text-lg" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 bg-white border-3 border-black shadow-[3px_3px_0px_#000] hover:bg-neo-yellow hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#000] transition-all"
        >
          <Icon icon={isOpen ? 'ph:x-bold' : 'ph:list-bold'} className="text-2xl" />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden mt-3 p-4 bg-white border-4 border-black shadow-[6px_6px_0px_#000] flex flex-col gap-3 transition-all">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 p-3 border-3 border-black font-extrabold text-base transition-all ${
                  isActive ? `${item.activeColor} shadow-[3px_3px_0px_#000]` : 'bg-[#F7F6F0] hover:bg-gray-100'
                }`
              }
            >
              <Icon icon={item.icon} className="text-xl" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
