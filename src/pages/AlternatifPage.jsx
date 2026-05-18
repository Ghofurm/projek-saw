import React, { useContext, useState } from 'react';
import { Icon } from '@iconify/react';
import { AppContext } from '../context/AppContext';

const AlternatifPage = () => {
  const { alternatives, addAlternative, updateAlternative, deleteAlternative } = useContext(AppContext);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [altName, setAltName] = useState('');

  const openAddModal = () => {
    setEditMode(false);
    setAltName('');
    setModalOpen(true);
  };

  const openEditModal = (alt) => {
    setEditMode(true);
    setCurrentId(alt.id);
    setAltName(alt.name);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!altName.trim()) {
      alert("Nama alternatif tidak boleh kosong!");
      return;
    }

    try {
      if (editMode) {
        await updateAlternative(currentId, altName.trim());
      } else {
        await addAlternative(altName.trim());
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data!");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus alternatif "${name}"? Nilai kriteria untuk alternatif ini juga akan dihapus.`)) {
      await deleteAlternative(id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div>
          <h2 className="text-3xl font-black uppercase flex items-center gap-2">
            <Icon icon="ph:users-three-bold" className="text-neo-orange" />
            <span>Data Alternatif</span>
          </h2>
          <p className="font-extrabold text-xs text-gray-600">
            Daftar produk-produk jualan Lookmanstore.id yang akan dinilai kelayakannya untuk promosi.
          </p>
        </div>
        
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-neo-orange border-3 border-black font-black text-sm shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] transition-all cursor-pointer"
        >
          <Icon icon="ph:plus-bold" className="text-lg" />
          <span>Tambah Alternatif</span>
        </button>
      </div>

      {/* Main Table Content */}
      {alternatives.length === 0 ? (
        <div className="bg-white p-12 neo-border neo-shadow text-center flex flex-col items-center justify-center gap-4">
          <Icon icon="ph:users-three-light" className="text-6xl text-gray-400" />
          <h3 className="text-xl font-black">Data Kosong!</h3>
          <p className="font-bold text-sm text-gray-500 max-w-sm">
            Belum ada data alternatif yang terdaftar. Klik tombol di kanan atas untuk menambahkan alternatif pertama Anda.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white neo-border neo-shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neo-orange border-b-3 border-black text-black">
                <th className="p-4 font-black text-sm w-20 border-r-3 border-black">No</th>
                <th className="p-4 font-black text-sm w-36 border-r-3 border-black">ID</th>
                <th className="p-4 font-black text-sm border-r-3 border-black">Nama Alternatif</th>
                <th className="p-4 font-black text-sm text-center w-48">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {alternatives.map((alt, index) => (
                <tr 
                  key={alt.id} 
                  className="border-b-3 border-black hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-extrabold text-sm border-r-3 border-black">{index + 1}</td>
                  <td className="p-4 font-mono text-sm border-r-3 border-black text-gray-600">{alt.id}</td>
                  <td className="p-4 font-extrabold text-sm border-r-3 border-black">{alt.name}</td>
                  <td className="p-4 flex items-center justify-center gap-3">
                    {/* Edit button */}
                    <button
                      onClick={() => openEditModal(alt)}
                      className="p-2 bg-neo-yellow border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] font-black text-xs transition-all cursor-pointer"
                      title="Edit Alternatif"
                    >
                      <Icon icon="ph:pencil-simple-line-bold" className="text-base" />
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(alt.id, alt.name)}
                      className="p-2 bg-neo-red text-white border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] font-black text-xs transition-all cursor-pointer"
                      title="Hapus Alternatif"
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
                <span>{editMode ? 'Edit Alternatif' : 'Tambah Alternatif'}</span>
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
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-sm uppercase">Nama Alternatif :</label>
                <input
                  type="text"
                  placeholder="Masukkan nama alternatif (contoh: Kemeja Flanel Lookman)"
                  value={altName}
                  onChange={(e) => setAltName(e.target.value)}
                  className="p-3 border-3 border-black bg-[#F7F6F0] font-bold text-sm shadow-[3px_3px_0px_#000] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_#000] focus:outline-none transition-all"
                  autoFocus
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
                  className="px-4 py-2 bg-neo-orange border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
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

export default AlternatifPage;
