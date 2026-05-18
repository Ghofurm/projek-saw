import React, { useContext, useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { AppContext } from '../context/AppContext';
import { calculateSAWSteps } from '../utils/sawHelper';

const KalkulatorPage = () => {
  const { criteria, alternatives, scores, updateScore } = useContext(AppContext);
  
  // Local state to handle input inputs to avoid laggy renders on big tables
  const [localScores, setLocalScores] = useState({});

  useEffect(() => {
    if (scores) {
      setLocalScores(JSON.parse(JSON.stringify(scores)));
    }
  }, [scores]);

  const handleLocalChange = (altId, critId, value) => {
    setLocalScores(prev => ({
      ...prev,
      [altId]: {
        ...prev[altId],
        [critId]: value
      }
    }));
  };

  const handleBlur = (altId, critId, value) => {
    const floatValue = parseFloat(value);
    updateScore(altId, critId, isNaN(floatValue) ? 0.0 : floatValue);
  };

  // Perform calculations
  const { minMax, stepDetails, rankings } = calculateSAWSteps(alternatives, criteria, scores);

  return (
    <div className="flex flex-col gap-10">
      
      {/* Title Header */}
      <div className="flex flex-col border-b-4 border-black pb-4">
        <h2 className="text-3xl font-black uppercase flex items-center gap-2">
          <Icon icon="ph:calculator-bold" className="text-neo-blue" />
          <span>Kalkulator & Perhitungan SAW</span>
        </h2>
        <p className="font-extrabold text-xs text-gray-600">
          Masukkan nilai alternatif untuk setiap kriteria dan saksikan proses normalisasi matematika secara langsung.
        </p>
      </div>

      {/* STEP 1: MATRIKS KEPUTUSAN AWAL (X) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 w-fit px-3 py-1 bg-neo-blue text-white border-3 border-black shadow-[3px_3px_0px_#000] font-black text-sm uppercase">
          Langkah 1: Matriks Keputusan Awal (X)
        </div>
        
        <p className="font-bold text-xs text-gray-600">
          *Ubah nilai pada sel input di bawah ini. Data disimpan secara otomatis saat kursor meninggalkan kotak input (onBlur).
        </p>

        {alternatives.length === 0 || criteria.length === 0 ? (
          <div className="bg-white p-8 neo-border neo-shadow text-center">
            <h4 className="font-black text-sm">Alternatif atau Kriteria Belum Ditentukan!</h4>
            <p className="text-xs mt-1 text-gray-500">Silakan tambahkan data alternatif dan kriteria terlebih dahulu di menu yang tersedia.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white neo-border neo-shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neo-blue text-white border-b-3 border-black">
                  <th className="p-3 font-black text-xs border-r-3 border-black w-48">Alternatif</th>
                  {criteria.map(c => (
                    <th key={c.id} className="p-3 border-r-3 border-black text-center min-w-[140px]">
                      <div className="font-black text-xs">{c.name}</div>
                      <div className="text-[10px] font-mono opacity-80 uppercase mt-0.5">
                        {c.id} ({c.type}) | w={c.weight.toFixed(2)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alternatives.map(alt => (
                  <tr key={alt.id} className="border-b-3 border-black">
                    <td className="p-3 font-extrabold text-xs bg-gray-50 border-r-3 border-black">
                      {alt.name}
                    </td>
                    {criteria.map(c => {
                      const cellValue = localScores[alt.id]?.[c.id] ?? '';
                      return (
                        <td key={c.id} className="p-2 border-r-3 border-black">
                          <input
                            type="number"
                            step="any"
                            placeholder="0.0"
                            value={cellValue}
                            onChange={(e) => handleLocalChange(alt.id, c.id, e.target.value)}
                            onBlur={(e) => handleBlur(alt.id, c.id, e.target.value)}
                            className="w-full p-2 font-mono font-bold text-center border-2 border-black bg-[#F7F6F0] focus:bg-white focus:outline-none transition-colors"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* STEP 2: PENENTUAN MIN/MAX KRITERIA */}
      {criteria.length > 0 && alternatives.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 w-fit px-3 py-1 bg-neo-yellow border-3 border-black shadow-[3px_3px_0px_#000] font-black text-sm uppercase">
            Langkah 2: Nilai Pembagi (Min / Max Kriteria)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {criteria.map(c => {
              const bounds = minMax[c.id] || { min: 0, max: 0 };
              return (
                <div key={c.id} className="bg-white p-4 neo-border neo-shadow flex flex-col gap-1">
                  <span className="font-extrabold text-xs uppercase text-gray-500">{c.id} - {c.name}</span>
                  <span className="font-black text-xs px-2 py-0.5 border border-black bg-gray-100 w-fit uppercase">
                    Tipe: {c.type}
                  </span>
                  <div className="flex gap-2 mt-2 pt-2 border-t border-dashed border-black font-mono text-xs">
                    <div className="flex-grow">
                      <span className="text-[10px] text-gray-600 block">Min</span>
                      <span className="font-extrabold text-neo-pink">{bounds.min.toFixed(2)}</span>
                    </div>
                    <div className="flex-grow border-l-2 border-gray-300 pl-2">
                      <span className="text-[10px] text-gray-600 block">Max</span>
                      <span className="font-extrabold text-neo-green">{bounds.max.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-gray-700 bg-gray-100 p-1 text-center">
                    Pembagi = {c.type === 'benefit' ? `Max (${bounds.max.toFixed(2)})` : `Min (${bounds.min.toFixed(2)})`}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* STEP 3: NORMALISASI MATRIKS (R) */}
      {criteria.length > 0 && alternatives.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 w-fit px-3 py-1 bg-neo-green border-3 border-black shadow-[3px_3px_0px_#000] font-black text-sm uppercase">
            Langkah 3: Matriks Normalisasi (R)
          </div>
          
          <div className="overflow-x-auto bg-white neo-border neo-shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neo-green text-black border-b-3 border-black">
                  <th className="p-3 font-black text-xs border-r-3 border-black w-48">Alternatif</th>
                  {criteria.map(c => (
                    <th key={c.id} className="p-3 border-r-3 border-black text-center min-w-[150px]">
                      <div className="font-black text-xs">{c.name}</div>
                      <div className="text-[10px] font-mono opacity-80 uppercase mt-0.5">{c.id}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alternatives.map(alt => (
                  <tr key={alt.id} className="border-b-3 border-black">
                    <td className="p-3 font-extrabold text-xs bg-gray-50 border-r-3 border-black">
                      {alt.name}
                    </td>
                    {criteria.map(c => {
                      const detail = stepDetails[alt.id]?.[c.id] || { normalizedValue: 0, equation: '0 / 0' };
                      return (
                        <td key={c.id} className="p-3 border-r-3 border-black text-center font-mono">
                          <div className="text-[10px] text-gray-500 font-semibold mb-0.5">{detail.equation}</div>
                          <div className="font-black text-sm text-neo-green">{detail.normalizedValue.toFixed(4)}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* STEP 4: PERKALIAN BOBOT & NILAI AKHIR (V) */}
      {criteria.length > 0 && alternatives.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 w-fit px-3 py-1 bg-neo-pink text-white border-3 border-black shadow-[3px_3px_0px_#000] font-black text-sm uppercase">
            Langkah 4: Nilai Preferensi / Skor Akhir (V)
          </div>
          
          <div className="overflow-x-auto bg-white neo-border neo-shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neo-pink text-white border-b-3 border-black">
                  <th className="p-3 font-black text-xs border-r-3 border-black w-48">Alternatif</th>
                  <th className="p-3 border-r-3 border-black text-center">
                    <div className="font-black text-xs">Penjumlahan Bobot * Kriteria</div>
                    <div className="text-[10px] opacity-85 font-mono">∑ (R_ij * W_j)</div>
                  </th>
                  <th className="p-3 text-center w-40">Skor Akhir (V)</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map(altRank => (
                  <tr key={altRank.id} className="border-b-3 border-black">
                    <td className="p-3 font-extrabold text-xs bg-gray-50 border-r-3 border-black">
                      {altRank.name}
                    </td>
                    <td className="p-3 border-r-3 border-black font-mono text-xs leading-relaxed">
                      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
                        {altRank.calculations.map((calc, idx) => (
                          <span key={idx} className="bg-gray-100 px-2 py-0.5 border border-black text-[10px]">
                            <span className="font-bold">{calc.criterionId}:</span> {calc.equation}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-center font-black text-base bg-neo-pink/15">
                      {altRank.totalScore.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </div>
  );
};

export default KalkulatorPage;
