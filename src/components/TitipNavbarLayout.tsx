import React, { useState } from 'react';
import { CartItem, ModuleConfig } from '../types/qu';

interface TitipNavbarLayoutProps {
  config: ModuleConfig;
  cart: CartItem[];
  onOpenPaymentModal?: () => void;
}

export const TitipNavbarLayout: React.FC<TitipNavbarLayoutProps> = ({
  config,
  cart,
  onOpenPaymentModal,
}) => {
  const [activeMenu, setActiveMenu] = useState<'penerimaan' | 'rak' | 'pengambilan'>('penerimaan');

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalAmount = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* SUB NAVBAR MENU */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex gap-4 text-xs font-medium text-slate-600 flex-shrink-0">
        <button
          onClick={() => setActiveMenu('penerimaan')}
          className={`pb-1 font-bold flex items-center gap-1.5 transition border-b-2 ${
            activeMenu === 'penerimaan'
              ? 'text-teal-700 border-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-box-archive"></i> Penerimaan Titipan
        </button>
        <button
          onClick={() => setActiveMenu('rak')}
          className={`pb-1 font-bold flex items-center gap-1.5 transition border-b-2 ${
            activeMenu === 'rak'
              ? 'text-teal-700 border-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-layer-group"></i> Rak & Lokasi Simpan
        </button>
        <button
          onClick={() => setActiveMenu('pengambilan')}
          className={`pb-1 font-bold flex items-center gap-1.5 transition border-b-2 ${
            activeMenu === 'pengambilan'
              ? 'text-teal-700 border-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-hand-holding-dollar"></i> Pengambilan & Nota
        </button>
      </nav>

      {/* FULL SCREEN CONTENT */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-teal-50/20">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                <i className={`fa-solid ${config.icon} text-teal-700`}></i>
                <span>Tampilan Utama {config.name}</span>
              </h2>
              <p className="text-xs text-slate-500">
                Modul ini menggunakan <b>Navbar Layout</b> untuk penataan loker, manajemen barang titipan, dan komisi penitip.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-teal-100 text-teal-800 px-2.5 py-1 rounded-full font-bold">
              Hub Drop-point #01
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50">
              <p className="text-xs text-slate-500">Paket / Titipan Aktif</p>
              <p className="font-bold text-slate-800 text-base mt-1">28 Paket Tersimpan</p>
              <span className="text-[10px] text-teal-700 font-semibold">Kapasitas Rak 70%</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-500">Item Keranjang Terhubung</p>
              <p className="font-bold text-slate-800 text-base mt-1">
                {totalItems} Item (Rp {totalAmount.toLocaleString('id-ID')})
              </p>
              <span className="text-[10px] text-slate-400">Sinkron Master Ekosistem</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-500">Jadwal Pengambilan Hari Ini</p>
              <p className="font-bold text-slate-800 text-base mt-1">11 Penerima Konfirmasi</p>
              <span className="text-[10px] text-slate-400">Batas simpan 3x24 Jam</span>
            </div>
          </div>

          {/* Locker Status Matrix */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Status Slot Rak Titipan (Rak A - C)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 text-xs">
              {['A-01', 'A-02', 'A-03', 'A-04', 'B-01', 'B-02', 'B-03', 'B-04', 'C-01', 'C-02', 'C-03', 'C-04'].map((slot, i) => {
                const isFull = [0, 2, 3, 5, 7, 8, 11].includes(i);
                return (
                  <div
                    key={slot}
                    className={`p-2.5 rounded-xl border text-center ${
                      isFull ? 'bg-teal-50 border-teal-300 text-teal-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="font-mono font-bold block">{slot}</span>
                    <span className={`text-[9px] font-semibold mt-0.5 inline-block px-1.5 rounded ${
                      isFull ? 'bg-teal-200/80 text-teal-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isFull ? 'Terisi' : 'Kosong'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {onOpenPaymentModal && totalItems > 0 && (
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-teal-900">Tagihan Jasa Titip Siap Diselesaikan</p>
                <p className="text-[11px] text-teal-700">Rp {totalAmount.toLocaleString('id-ID')}</p>
              </div>
              <button
                onClick={onOpenPaymentModal}
                className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-teal-700/30 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-cash-register"></i> Proses Pembayaran
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
