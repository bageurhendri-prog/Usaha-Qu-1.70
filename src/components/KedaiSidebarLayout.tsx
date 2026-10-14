import React, { useState } from 'react';
import { CartItem, ModuleConfig } from '../types/qu';

interface KedaiSidebarLayoutProps {
  config: ModuleConfig;
  cart: CartItem[];
  onOpenPaymentModal?: () => void;
}

export const KedaiSidebarLayout: React.FC<KedaiSidebarLayoutProps> = ({
  config,
  cart,
  onOpenPaymentModal,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'antrean' | 'stok' | 'laporan'>('dashboard');

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalAmount = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="flex-1 flex overflow-hidden h-full">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col p-3 space-y-1 flex-shrink-0">
        <div className="px-3 py-2 font-bold text-xs uppercase tracking-wider text-slate-400">
          Navigasi {config.name}
        </div>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2.5 text-xs font-semibold px-3 py-2.5 rounded-xl transition text-left ${
            activeTab === 'dashboard'
              ? 'bg-amber-50 text-amber-800 border border-amber-200/80 font-bold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-chart-pie w-4 text-center"></i>
          <span>Dashboard Kedai</span>
        </button>
        <button
          onClick={() => setActiveTab('antrean')}
          className={`flex items-center gap-2.5 text-xs font-medium px-3 py-2.5 rounded-xl transition text-left ${
            activeTab === 'antrean'
              ? 'bg-amber-50 text-amber-800 border border-amber-200/80 font-bold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-list-check w-4 text-center"></i>
          <span>Daftar Antrean / Meja</span>
        </button>
        <button
          onClick={() => setActiveTab('stok')}
          className={`flex items-center gap-2.5 text-xs font-medium px-3 py-2.5 rounded-xl transition text-left ${
            activeTab === 'stok'
              ? 'bg-amber-50 text-amber-800 border border-amber-200/80 font-bold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-boxes-stacked w-4 text-center"></i>
          <span>Stok Bahan Baku</span>
        </button>
        <button
          onClick={() => setActiveTab('laporan')}
          className={`flex items-center gap-2.5 text-xs font-medium px-3 py-2.5 rounded-xl transition text-left ${
            activeTab === 'laporan'
              ? 'bg-amber-50 text-amber-800 border border-amber-200/80 font-bold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-clock-rotate-left w-4 text-center"></i>
          <span>Laporan Shift</span>
        </button>

        <div className="pt-4 mt-auto border-t border-slate-100 text-[11px] text-slate-400 px-3">
          <p className="font-semibold text-slate-700">Kedai Coffee & Eatery</p>
          <p>POS & Barista Terminal v1.65</p>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-amber-50/30">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm max-w-5xl mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
              <i className={`fa-solid ${config.icon} text-amber-600`}></i>
              <span>Workspace Modul {config.name}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Modul ini beroperasi menggunakan <b>Sidebar Layout</b> yang terstruktur untuk manajemen alur kerja bertahap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
              <p className="text-xs text-slate-500">Status Operasional</p>
              <p className="font-bold text-slate-800 text-sm mt-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Aktif & Sinkron (Shift Pagi)</span>
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-500">Item Keranjang Terhubung</p>
              <p id="sidebar-cart-count" className="font-bold text-slate-800 text-sm mt-1">
                {totalItems} Item (Rp {totalAmount.toLocaleString('id-ID')})
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-500">Meja Terisi</p>
              <p className="font-bold text-slate-800 text-sm mt-1">7 / 12 Meja Aktif</p>
            </div>
          </div>

          {/* Quick Table Grid Overview */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Status Meja Dine-in
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((table) => {
                const isOccupied = [1, 2, 4, 7, 9, 10, 12].includes(table);
                return (
                  <div
                    key={table}
                    className={`p-3 rounded-xl border text-center transition ${
                      isOccupied
                        ? 'border-amber-300 bg-amber-50/80 text-amber-900'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <span className="text-[10px] block font-bold text-slate-400">MEJA</span>
                    <span className="text-base font-extrabold">{String(table).padStart(2, '0')}</span>
                    <span
                      className={`text-[9px] block font-semibold mt-1 px-1 py-0.5 rounded ${
                        isOccupied ? 'bg-amber-200/80 text-amber-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isOccupied ? 'Terisi' : 'Kosong'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {onOpenPaymentModal && totalItems > 0 && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-amber-900">Pesanan Aktif Siap Dibayar</p>
                <p className="text-[11px] text-amber-700">{totalItems} item tercatat di sistem pusat</p>
              </div>
              <button
                onClick={onOpenPaymentModal}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-amber-600/30 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-cash-register"></i> Buka Kasir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
