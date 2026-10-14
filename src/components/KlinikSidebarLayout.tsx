import React, { useState } from 'react';
import { CartItem, ModuleConfig } from '../types/qu';

interface KlinikSidebarLayoutProps {
  config: ModuleConfig;
  cart: CartItem[];
  onOpenPaymentModal?: () => void;
}

export const KlinikSidebarLayout: React.FC<KlinikSidebarLayoutProps> = ({
  config,
  cart,
  onOpenPaymentModal,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rekam' | 'farmasi' | 'kasir'>('dashboard');

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
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-chart-pie w-4 text-center"></i>
          <span>Dashboard Poli</span>
        </button>
        <button
          onClick={() => setActiveTab('rekam')}
          className={`flex items-center gap-2.5 text-xs font-medium px-3 py-2.5 rounded-xl transition text-left ${
            activeTab === 'rekam'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-notes-medical w-4 text-center"></i>
          <span>Rekam Medis & Antrean</span>
        </button>
        <button
          onClick={() => setActiveTab('farmasi')}
          className={`flex items-center gap-2.5 text-xs font-medium px-3 py-2.5 rounded-xl transition text-left ${
            activeTab === 'farmasi'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-prescription-bottle-medical w-4 text-center"></i>
          <span>Farmasi & Resep Obat</span>
        </button>
        <button
          onClick={() => setActiveTab('kasir')}
          className={`flex items-center gap-2.5 text-xs font-medium px-3 py-2.5 rounded-xl transition text-left ${
            activeTab === 'kasir'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <i className="fa-solid fa-file-invoice-dollar w-4 text-center"></i>
          <span>Kasir & Klaim BPJS/Umum</span>
        </button>

        <div className="pt-4 mt-auto border-t border-slate-100 text-[11px] text-slate-400 px-3">
          <p className="font-semibold text-slate-700">Klinik Pratama Sehat</p>
          <p>Sistem Informasi Klinik v1.65</p>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-emerald-50/20">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm max-w-5xl mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
              <i className={`fa-solid ${config.icon} text-emerald-600`}></i>
              <span>Workspace Modul {config.name}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Modul ini beroperasi menggunakan <b>Sidebar Layout</b> yang terstruktur untuk alur pasien, rekam medis, dan farmasi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <p className="text-xs text-slate-500">Dokter Jaga Hari Ini</p>
              <p className="font-bold text-slate-800 text-sm mt-1">dr. Anisa Putri, Sp.PD</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-500">Item Keranjang Terhubung</p>
              <p className="font-bold text-slate-800 text-sm mt-1">
                {totalItems} Item (Rp {totalAmount.toLocaleString('id-ID')})
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-500">Antrean Pasien</p>
              <p className="font-bold text-slate-800 text-sm mt-1">14 Pasien Terdaftar</p>
            </div>
          </div>

          {/* Patient Queue Cards */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Antrean Poli Umum & Gigi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {[
                { no: 'A-01', name: 'Ny. Siti Rahmawati', poli: 'Poli Umum', status: 'Diperiksa' },
                { no: 'A-02', name: 'Bpk. Ahmad Fauzi', poli: 'Poli Gigi', status: 'Menunggu' },
                { no: 'A-03', name: 'Ananda Kevin', poli: 'Poli Anak', status: 'Menunggu' },
              ].map((p, idx) => (
                <div key={idx} className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 flex justify-between items-center">
                  <div>
                    <span className="font-mono text-emerald-700 font-bold text-xs">{p.no}</span>
                    <p className="font-bold text-slate-800">{p.name}</p>
                    <span className="text-[10px] text-slate-400">{p.poli}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    p.status === 'Diperiksa' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {onOpenPaymentModal && totalItems > 0 && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-emerald-900">Tagihan Farmasi / Resep Terkoneksi</p>
                <p className="text-[11px] text-emerald-700">{totalItems} item resep siap ditebus</p>
              </div>
              <button
                onClick={onOpenPaymentModal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-cash-register"></i> Kasir Farmasi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
