import React, { useState } from 'react';
import { CartItem, ModuleConfig } from '../types/qu';

interface RitelNavbarLayoutProps {
  config: ModuleConfig;
  cart: CartItem[];
  onOpenPaymentModal?: () => void;
}

export const RitelNavbarLayout: React.FC<RitelNavbarLayoutProps> = ({
  config,
  cart,
  onOpenPaymentModal,
}) => {
  const [activeMenu, setActiveMenu] = useState<'penjualan' | 'barcode' | 'retur'>('penjualan');

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalAmount = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* SUB NAVBAR MENU */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex gap-4 text-xs font-medium text-slate-600 flex-shrink-0">
        <button
          onClick={() => setActiveMenu('penjualan')}
          className={`pb-1 font-bold flex items-center gap-1.5 transition border-b-2 ${
            activeMenu === 'penjualan'
              ? 'text-indigo-600 border-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-store"></i> Area Penjualan (POS)
        </button>
        <button
          onClick={() => setActiveMenu('barcode')}
          className={`pb-1 font-bold flex items-center gap-1.5 transition border-b-2 ${
            activeMenu === 'barcode'
              ? 'text-indigo-600 border-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-barcode"></i> Scan Barcode Cepat
        </button>
        <button
          onClick={() => setActiveMenu('retur')}
          className={`pb-1 font-bold flex items-center gap-1.5 transition border-b-2 ${
            activeMenu === 'retur'
              ? 'text-indigo-600 border-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-truck-ramp-box"></i> Retur & Konsinyasi
        </button>
      </nav>

      {/* FULL SCREEN CONTENT */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-indigo-50/20">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                <i className={`fa-solid ${config.icon} text-indigo-600`}></i>
                <span>Tampilan Utama {config.name}</span>
              </h2>
              <p className="text-xs text-slate-500">
                Modul ini menggunakan <b>Navbar Layout</b> tanpa sidebar untuk memberikan ruang layar penuh saat pemindaian barang atau pencatatan konsinyasi.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full font-bold">
              Kasir Reguler #02
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50">
              <p className="text-xs text-slate-500">Omset Hari Ini</p>
              <p className="font-bold text-slate-800 text-base mt-1">Rp 4.850.000</p>
              <span className="text-[10px] text-emerald-600 font-semibold">↑ 12% dibanding kemarin</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-500">Item Keranjang Terhubung</p>
              <p className="font-bold text-slate-800 text-base mt-1">
                {totalItems} Item (Rp {totalAmount.toLocaleString('id-ID')})
              </p>
              <span className="text-[10px] text-slate-400">Sinkron Master Ekosistem</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-500">Scanner Status</p>
              <p className="font-bold text-emerald-600 text-base mt-1 flex items-center gap-1.5">
                <i className="fa-solid fa-wifi text-xs"></i> Barcode USB Siap
              </p>
              <span className="text-[10px] text-slate-400">EAN-13 / Code128 Auto</span>
            </div>
          </div>

          {/* Barcode Simulator Section */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Input Cepat Kode Barcode Barang
            </h3>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Scan barcode atau ketik SKU produk..."
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700">
                Cari SKU
              </button>
            </div>
          </div>

          {onOpenPaymentModal && totalItems > 0 && (
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-indigo-900">Total Transaksi Kasir Siap Bayar</p>
                <p className="text-[11px] text-indigo-700">Rp {totalAmount.toLocaleString('id-ID')} ({totalItems} item)</p>
              </div>
              <button
                onClick={onOpenPaymentModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-cash-register"></i> Bayar Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
