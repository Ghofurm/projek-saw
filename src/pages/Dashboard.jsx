import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
  const { criteria, alternatives, resetAllData } = useContext(AppContext);

  const handleReset = async () => {
    if (window.confirm("Apakah Anda yakin ingin mengatur ulang data kembali ke setelan pabrik (dummy data)? Semua data baru yang Anda masukkan akan hilang.")) {
      await resetAllData();
      alert("Data berhasil diatur ulang!");
    }
  };

  const steps = [
    { 
      num: '01', 
      title: 'Definisikan Kriteria & Bobot', 
      desc: 'Tentukan faktor penentu keputusan beserta tingkat kepentingannya (bobot).',
      color: 'bg-neo-orange',
      link: '/kriteria'
    },
    { 
      num: '02', 
      title: 'Tentukan Alternatif Pilihan', 
      desc: 'Masukkan daftar entitas atau pilihan yang akan dinilai oleh sistem.',
      color: 'bg-neo-green',
      link: '/alternatif'
    },
    { 
      num: '03', 
      title: 'Input Nilai Keputusan', 
      desc: 'Berikan penilaian untuk setiap alternatif pada masing-masing kriteria.',
      color: 'bg-neo-blue',
      link: '/kalkulator'
    },
    { 
      num: '04', 
      title: 'Perhitungan & Hasil', 
      desc: 'Sistem menormalkan matriks dan menghitung skor akhir untuk peringkat.',
      color: 'bg-neo-pink',
      link: '/perangkingan'
    }
  ];

  return (
    <div className="flex flex-col gap-10">
      
      {/* Hero Banner Section */}
      <section className="bg-neo-yellow neo-border neo-shadow-lg p-8 md:p-12 text-black relative overflow-hidden flex flex-col gap-6">
        <div className="absolute right-4 top-4 hidden md:block">
          <Icon icon="ph:sketch-logo-fill" className="text-9xl text-black opacity-10" />
        </div>
        
        <span className="font-extrabold text-xs uppercase tracking-widest px-3 py-1 bg-black text-neo-yellow w-fit border-2 border-black">
          Decision Support System ✦ SAW Method
        </span>
        
        <h1 className="text-4xl md:text-6xl font-black leading-none m-0 uppercase tracking-tight">
          Pilih Terbaik Dengan Hitungan Pasti!
        </h1>
        
        <p className="font-extrabold text-lg md:text-xl max-w-3xl text-gray-800 leading-relaxed">
          Sistem Pendukung Keputusan (SPK) berbasis web dengan metode **Simple Additive Weighting (SAW)**. 
          Sederhanakan proses pengambilan keputusan multi-kriteria secara transparan, akurat, dan estetik.
        </p>

        <div className="flex flex-wrap gap-4 mt-2">
          <Link 
            to="/kalkulator" 
            className="flex items-center gap-2 px-6 py-3 bg-black text-white border-3 border-black shadow-[4px_4px_0px_#FFE600] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#FFE600] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#FFE600] font-black transition-all"
          >
            <span>Mulai Hitung Sekarang</span>
            <Icon icon="ph:arrow-right-bold" className="text-xl" />
          </Link>
          
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black border-3 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] font-black transition-all"
          >
            <Icon icon="ph:arrow-counter-clockwise-bold" className="text-xl" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 neo-border neo-shadow flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-black">{criteria.length}</h3>
            <p className="font-extrabold text-sm text-gray-600">Total Kriteria Aktif</p>
          </div>
          <div className="p-4 bg-neo-orange border-3 border-black neo-shadow-sm">
            <Icon icon="ph:sliders-horizontal-bold" className="text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 neo-border neo-shadow flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-black">{alternatives.length}</h3>
            <p className="font-extrabold text-sm text-gray-600">Total Alternatif Dinilai</p>
          </div>
          <div className="p-4 bg-neo-green border-3 border-black neo-shadow-sm">
            <Icon icon="ph:users-three-bold" className="text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 neo-border neo-shadow flex items-center justify-between col-span-1 md:col-span-1">
          <div>
            <h3 className="text-3xl font-black">SAW</h3>
            <p className="font-extrabold text-sm text-gray-600">Metode Penjumlahan Berbobot</p>
          </div>
          <div className="p-4 bg-neo-blue border-3 border-black neo-shadow-sm text-white">
            <Icon icon="ph:calculator-bold" className="text-3xl" />
          </div>
        </div>
      </section>

      {/* Steps & Workflow */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl md:text-3xl font-black uppercase text-center border-b-4 border-black pb-2 w-fit mx-auto">
          Alur Kerja SPK SAW
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <Link 
              to={step.link} 
              key={idx} 
              className="bg-white p-6 neo-border neo-shadow flex flex-col gap-4 group hover:translate-y-[-4px] transition-all cursor-pointer"
            >
              <div className={`w-12 h-12 flex items-center justify-center border-3 border-black text-xl font-black ${step.color}`}>
                {step.num}
              </div>
              <h3 className="font-black text-lg group-hover:text-neo-blue transition-colors">
                {step.title}
              </h3>
              <p className="font-bold text-xs text-gray-600 leading-relaxed">
                {step.desc}
              </p>
              <span className="mt-auto font-black text-xs text-neo-blue flex items-center gap-1 group-hover:underline">
                Buka menu <Icon icon="ph:arrow-right-bold" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Brief Explanation */}
      <section className="bg-white p-6 md:p-8 neo-border neo-shadow grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-black uppercase">Apa itu Metode SAW?</h3>
          <p className="font-bold text-sm text-gray-700 leading-relaxed">
            Metode **Simple Additive Weighting (SAW)** sering dikenal dengan istilah metode penjumlahan berbobot. 
            Konsep dasar metode ini adalah mencari penjumlahan berbobot dari rating kinerja pada setiap alternatif untuk semua kriteria.
          </p>
          <p className="font-bold text-sm text-gray-700 leading-relaxed">
            Metode ini membutuhkan proses **Normalisasi** matriks keputusan ($X$) ke suatu skala yang dapat diperbandingkan dengan semua rating alternatif yang ada. 
            Tipe kriteria dibagi menjadi dua, yaitu **Benefit** (semakin besar semakin bagus) dan **Cost** (semakin kecil semakin bagus).
          </p>
        </div>
        <div className="bg-neo-purple p-6 border-4 border-black neo-shadow-lg text-white flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <Icon icon="ph:math-operations-bold" className="text-2xl" />
            <h4 className="font-black text-base uppercase">Rumus Normalisasi SAW</h4>
          </div>
          <div className="flex flex-col gap-3 font-mono text-xs">
            <div className="bg-black/20 p-3 border-2 border-black">
              <span className="font-bold block text-neo-yellow mb-1">✦ Kriteria BENEFIT (Keuntungan)</span>
              <span>R_ij = X_ij / Max(X_ij)</span>
            </div>
            <div className="bg-black/20 p-3 border-2 border-black">
              <span className="font-bold block text-neo-orange mb-1">✦ Kriteria COST (Biaya)</span>
              <span>R_ij = Min(X_ij) / X_ij</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
