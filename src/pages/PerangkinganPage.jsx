import React, { useContext } from 'react';
import { Icon } from '@iconify/react';
import { AppContext } from '../context/AppContext';
import { calculateSAWSteps } from '../utils/sawHelper';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';

const PerangkinganPage = () => {
  const { criteria, alternatives, scores } = useContext(AppContext);

  // Perform full calculation
  const { rankings } = calculateSAWSteps(alternatives, criteria, scores);

  // Color schemes for Neobrutalism bars
  const barColors = [
    '#FFE600', // neo-yellow
    '#FF9F1C', // neo-orange
    '#2EC4B6', // neo-green
    '#3A86C8', // neo-blue
    '#FF007F', // neo-pink
    '#9b5de5'  // neo-purple
  ];

  // Custom tooltips for Neobrutalism chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border-3 border-black shadow-[3px_3px_0px_#000] font-sans text-xs">
          <p className="font-black border-b border-black pb-1 mb-1">{data.name}</p>
          <p className="font-extrabold text-neo-purple">
            Skor Akhir: <span className="text-sm font-black underline">{data.totalScore.toFixed(4)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-10">
      
      {/* Title Header */}
      <div className="flex flex-col border-b-4 border-black pb-4">
        <h2 className="text-3xl font-black uppercase flex items-center gap-2">
          <Icon icon="ph:trophy-bold" className="text-neo-pink" />
          <span>Hasil Perangkingan & Grafik</span>
        </h2>
        <p className="font-extrabold text-xs text-gray-600">
          Lihat peringkat akhir alternatif keputusan berdasarkan total skor preferensi SAW beserta representasi grafisnya.
        </p>
      </div>

      {alternatives.length === 0 || criteria.length === 0 ? (
        <div className="bg-white p-12 neo-border neo-shadow text-center">
          <h4 className="font-black text-sm">Tidak Ada Data untuk Diperhitungkan!</h4>
          <p className="text-xs mt-1 text-gray-500">Isi data alternatif dan kriteria terlebih dahulu sebelum melihat perangkingan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* LEADERBOARD TABLE (cols 2/5) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2 w-fit px-3 py-1 bg-neo-pink text-white border-3 border-black shadow-[3px_3px_0px_#000] font-black text-sm uppercase">
              Tabel Peringkat (Leaderboard)
            </div>

            <div className="overflow-x-auto bg-white neo-border neo-shadow">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neo-pink text-white border-b-3 border-black">
                    <th className="p-3 font-black text-xs w-20 border-r-3 border-black text-center">Rank</th>
                    <th className="p-3 font-black text-xs border-r-3 border-black">Nama Alternatif</th>
                    <th className="p-3 font-black text-xs text-center w-28">Skor Akhir</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((altRank, idx) => {
                    const isTopThree = idx < 3;
                    const badgeColors = [
                      'bg-neo-yellow text-black border-black',
                      'bg-gray-200 text-black border-black',
                      'bg-neo-orange text-black border-black'
                    ];

                    return (
                      <tr 
                        key={altRank.id} 
                        className={`border-b-3 border-black transition-colors ${
                          idx === 0 ? 'bg-neo-yellow/10 font-bold' : ''
                        }`}
                      >
                        <td className="p-3 border-r-3 border-black text-center flex items-center justify-center">
                          {isTopThree ? (
                            <span className={`w-8 h-8 rounded-none border-2 flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000] ${badgeColors[idx]}`}>
                              {idx + 1}
                            </span>
                          ) : (
                            <span className="font-bold text-xs">{idx + 1}</span>
                          )}
                        </td>
                        <td className="p-3 border-r-3 border-black font-extrabold text-xs">
                          {altRank.name}
                          {idx === 0 && (
                            <span className="ml-2 inline-flex items-center gap-0.5 px-2 py-0.5 bg-neo-green text-black text-[9px] font-black border border-black uppercase shadow-[1px_1px_0px_#000]">
                              Terbaik <Icon icon="ph:crown-bold" />
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center font-mono font-black text-xs bg-gray-50">
                          {altRank.totalScore.toFixed(4)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* VISUALIZATION CHART (cols 3/5) */}
          <div className="lg:col-span-3 flex flex-col gap-4 w-full">
            <div className="flex items-center gap-2 w-fit px-3 py-1 bg-neo-yellow border-3 border-black shadow-[3px_3px_0px_#000] font-black text-sm uppercase">
              Grafik Hasil Evaluasi
            </div>

            <div className="bg-white p-4 md:p-6 neo-border neo-shadow w-full">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={rankings} 
                    margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="0" 
                      stroke="#000000" 
                      strokeOpacity={0.15} 
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#000000', fontSize: 10, fontWeight: 800 }}
                      axisLine={{ stroke: '#000000', strokeWidth: 3 }}
                      tickLine={{ stroke: '#000000', strokeWidth: 2 }}
                    />
                    <YAxis 
                      domain={[0, 1]} 
                      tick={{ fill: '#000000', fontSize: 10, fontWeight: 800 }}
                      axisLine={{ stroke: '#000000', strokeWidth: 3 }}
                      tickLine={{ stroke: '#000000', strokeWidth: 2 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                    <Bar 
                      dataKey="totalScore" 
                      radius={0}
                    >
                      {rankings.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={barColors[index % barColors.length]} 
                          stroke="#000000" 
                          strokeWidth={3}
                          style={{
                            filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,1))'
                          }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-3 bg-neo-yellow/15 border-2 border-black font-semibold text-xs text-gray-700 leading-relaxed">
                <Icon icon="ph:info-bold" className="inline text-base mr-1 mb-0.5 text-black" />
                Grafik di atas membandingkan total skor akhir tiap alternatif. Semakin tinggi batang grafik, semakin tinggi prioritas alternatif tersebut untuk dipilih sebagai keputusan optimal berdasarkan kriteria yang telah ditentukan.
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default PerangkinganPage;
