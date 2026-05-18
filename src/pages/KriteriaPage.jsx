import React, { useContext, useState } from 'react';
import { Icon } from '@iconify/react';
import { AppContext } from '../context/AppContext';

const KriteriaPage = () => {
  const { criteria, addCriterion, updateCriterion, deleteCriterion } = useContext(AppContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  
  // Form states
  const [critName, setCritName] = useState('');
  const [critType, setCritType] = useState('benefit');
  const [critWeight, setCritWeight] = useState('0.10');

  // Calculate Total Weight
  const totalWeight = criteria.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0);
  const isWeightBalanced = Math.abs(totalWeight - 1.0) < 0.0001;

  const openAddModal = () => {
    setEditMode(false);
    setCritName('');
    setCritType('benefit');
    setCritWeight('0.10');
    setModalOpen(true);
  };

  const openEditModal = (crit) => {
    setEditMode(true);
    setCurrentId(crit.id);
    setCritName(crit.name);
    setCritType(crit.type);
    setCritWeight(crit.weight.toString());
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!critName.trim()) {
      alert("Nama kriteria tidak boleh kosong!");
      return;
    }
    const weightVal = parseFloat(critWeight);
    if (isNaN(weightVal) || weightVal < 0) {
      alert("Nilai bobot harus berupa angka positif!");
      return;
    }

    try {
      if (editMode) {
        await updateCriterion(currentId, critName.trim(), critType, weightVal);
      } else {
        await addCriterion(critName.trim(), critType, weightVal);
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data!");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kriteria "${name}"? Kriteria ini akan dihapus dari seluruh penilaian alternatif.`)) {
      await deleteCriterion(id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div>
          <h2 className="text-3xl font-black uppercase flex items-center gap-2">
            <Icon icon="ph:sliders-horizontal-bold" className="text-neo-green" />
            <span>Kriteria & Bobot</span>
          </h2>
          <p className="font-extrabold text-xs text-gray-600">
            Daftar parameter penilaian produk (seperti ROI iklan, tren pasar, dll.) beserta bobot tingkat kepentingannya.
          </p>
        </div>
        
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-neo-green border-3 border-black font-black text-sm shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] transition-all cursor-pointer"
        >
          <Icon icon="ph:plus-bold" className="text-lg" />
          <span>Tambah Kriteria</span>
        </button>
      </div>

      {/* Weight Balancing Warning Banner */}
      {criteria.length > 0 && (
        <div 
          className={`p-4 neo-border neo-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-extrabold ${
            isWeightBalanced 
              ? 'bg-neo-green/30 text-emerald-900 border-emerald-600' 
              : 'bg-neo-yellow/30 text-amber-900 border-amber-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon 
              icon={isWeightBalanced ? 'ph:check-circle-bold' : 'ph:warning-circle-bold'} 
              className="text-2xl shrink-0" 
            />
            <div>
              <p className="text-sm">
                Total Bobot Kriteria Saat Ini: <span className="font-black text-base underline">{totalWeight.toFixed(4)}</span>
              </p>
              <p className="text-xs font-semibold mt-0.5">
                {isWeightBalanced 
                  ? 'Keseimbangan bobot pas 1.0 (100%). Perangkingan siap dijalankan dengan akurat!'
                  : 'Sangat disarankan total bobot bernilai tepat 1.0 (100%) agar hasil normalisasi presisi.'
                }
              </p>
            </div>
          </div>
          {!isWeightBalanced && (
            <span className="text-xs uppercase bg-black text-neo-yellow px-2 py-1 border-2 border-black w-fit h-fit">
              Penyesuaian Diperlukan
            </span>
          )}
        </div>
      )}

      {/* Main Table Content */}
      {criteria.length === 0 ? (
        <div className="bg-white p-12 neo-border neo-shadow text-center flex flex-col items-center justify-center gap-4">
          <Icon icon="ph:sliders-horizontal-light" className="text-6xl text-gray-400" />
          <h3 className="text-xl font-black">Data Kosong!</h3>
          <p className="font-bold text-sm text-gray-500 max-w-sm">
            Belum ada kriteria penilaian yang didaftarkan. Tambahkan kriteria baru untuk memulai penilaian alternatif.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white neo-border neo-shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neo-green border-b-3 border-black text-black">
                <th className="p-4 font-black text-sm w-20 border-r-3 border-black">No</th>
                <th className="p-4 font-black text-sm w-28 border-r-3 border-black">ID</th>
                <th className="p-4 font-black text-sm border-r-3 border-black">Nama Kriteria</th>
                <th className="p-4 font-black text-sm w-44 border-r-3 border-black">Tipe</th>
                <th className="p-4 font-black text-sm w-44 border-r-3 border-black">Bobot (Float)</th>
                <th className="p-4 font-black text-sm text-center w-48">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((crit, index) => (
                <tr 
                  key={crit.id} 
                  className="border-b-3 border-black hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-extrabold text-sm border-r-3 border-black">{index + 1}</td>
                  <td className="p-4 font-mono text-sm border-r-3 border-black text-gray-600">{crit.id}</td>
                  <td className="p-4 font-extrabold text-sm border-r-3 border-black">{crit.name}</td>
                  <td className="p-4 border-r-3 border-black">
                    <span 
                      className={`inline-block px-3 py-1 font-black text-xs border-2 border-black ${
                        crit.type === 'benefit' 
                          ? 'bg-neo-blue/20 text-blue-900' 
                          : 'bg-neo-pink/20 text-rose-900'
                      }`}
                    >
                      {crit.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-extrabold text-sm border-r-3 border-black">
                    {parseFloat(crit.weight).toFixed(4)}
                  </td>
                  <td className="p-4 flex items-center justify-center gap-3">
                    {/* Edit button */}
                    <button
                      onClick={() => openEditModal(crit)}
                      className="p-2 bg-neo-yellow border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] font-black text-xs transition-all cursor-pointer"
                      title="Edit Kriteria"
                    >
                      <Icon icon="ph:pencil-simple-line-bold" className="text-base" />
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(crit.id, crit.name)}
                      className="p-2 bg-neo-red text-white border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] font-black text-xs transition-all cursor-pointer"
                      title="Hapus Kriteria"
                    >
                      <Icon icon="ph:trash-bold" className="text-base" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Neobrutalism Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="bg-white max-w-md w-full neo-border neo-shadow-lg p-6 flex flex-col gap-4 animate-in fade-in zoom-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-3 border-black pb-3">
              <h3 className="text-xl font-black uppercase flex items-center gap-2">
                <Icon icon={editMode ? 'ph:pencil-simple-line-bold' : 'ph:plus-bold'} />
                <span>{editMode ? 'Edit Kriteria' : 'Tambah Kriteria'}</span>
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 bg-[#F7F6F0] border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-neo-red hover:text-white transition-all cursor-pointer"
              >
                <Icon icon="ph:x-bold" className="text-lg" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Name input */}
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-sm uppercase">Nama Kriteria :</label>
                <input
                  type="text"
                  placeholder="Masukkan nama (contoh: Estimasi ROI Promosi)"
                  value={critName}
                  onChange={(e) => setCritName(e.target.value)}
                  className="p-3 border-3 border-black bg-[#F7F6F0] font-bold text-sm shadow-[3px_3px_0px_#000] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_#000] focus:outline-none transition-all"
                  autoFocus
                />
              </div>

              {/* Type Select */}
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-sm uppercase">Tipe Kriteria :</label>
                <select
                  value={critType}
                  onChange={(e) => setCritType(e.target.value)}
                  className="p-3 border-3 border-black bg-[#F7F6F0] font-bold text-sm shadow-[3px_3px_0px_#000] focus:outline-none transition-all"
                >
                  <option value="benefit">BENEFIT (Semakin besar nilai, semakin baik)</option>
                  <option value="cost">COST (Semakin kecil nilai, semakin baik)</option>
                </select>
              </div>

              {/* Weight Float input */}
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-sm uppercase">Bobot Kriteria (Float, 0 s/d 1) :</label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  max="1"
                  placeholder="Masukkan bobot desimal (contoh: 0.30)"
                  value={critWeight}
                  onChange={(e) => setCritWeight(e.target.value)}
                  className="p-3 border-3 border-black bg-[#F7F6F0] font-mono font-bold text-sm shadow-[3px_3px_0px_#000] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_#000] focus:outline-none transition-all"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 mt-4 border-t-3 border-black pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 border-2 border-black font-extrabold text-xs shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neo-green border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
                >
                  {editMode ? 'Simpan Perubahan' : 'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default KriteriaPage;
