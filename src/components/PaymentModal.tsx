import React, { useState } from 'react';
import { CustomerVehicleInfo } from '../types/qu';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  customerInfo: CustomerVehicleInfo;
  onProcessPayment: (method: 'QRIS' | 'Tunai' | 'Transfer', amountPaid: number, change: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  customerInfo,
  onProcessPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Tunai' | 'Transfer'>('QRIS');
  const [cashAmount, setCashAmount] = useState<number>(total);

  if (!isOpen) return null;

  const quickNominals = [
    { label: 'Uang Pas', value: total },
    { label: '50.000', value: 50000 },
    { label: '100.000', value: 100000 },
    { label: '200.000', value: 200000 },
    { label: '500.000', value: 500000 },
  ].filter(n => n.value >= total || n.label === 'Uang Pas');

  const change = Math.max(0, cashAmount - total);
  const isCashInsufficient = paymentMethod === 'Tunai' && cashAmount < total;

  const handleSubmit = () => {
    if (isCashInsufficient) return;
    const paid = paymentMethod === 'Tunai' ? cashAmount : total;
    const calculatedChange = paymentMethod === 'Tunai' ? Math.max(0, cashAmount - total) : 0;
    onProcessPayment(paymentMethod, paid, calculatedChange);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl animate-fade-in flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <i className="fa-solid fa-cash-register text-blue-600"></i>
              <span>Pembayaran Kasir / SPK</span>
            </h3>
            <p className="text-[11px] text-slate-400">Pilih metode pembayaran untuk menyelesaikan transaksi</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Invoice Summary Box */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-4 rounded-xl mb-4 border border-blue-100/60">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Tagihan Transaksi</p>
              <p className="text-2xl sm:text-3xl font-black text-blue-700 tracking-tight">
                Rp {total.toLocaleString('id-ID')}
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
              {customerInfo.spkNumber || '#SPK-0921'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Pelanggan:</span>
              <span className="font-semibold text-slate-700 truncate block">{customerInfo.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Kendaraan / Plat:</span>
              <span className="font-mono font-bold text-slate-800">{customerInfo.plate || '-'}</span>
            </div>
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('QRIS')}
            className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              paymentMethod === 'QRIS'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-qrcode"></i> QRIS
          </button>
          <button
            type="button"
            onClick={() => {
              setPaymentMethod('Tunai');
              setCashAmount(total);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              paymentMethod === 'Tunai'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-money-bill-wave"></i> Tunai (Cash)
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('Transfer')}
            className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              paymentMethod === 'Transfer'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-building-columns"></i> Transfer
          </button>
        </div>

        {/* Tab Contents */}
        {paymentMethod === 'QRIS' && (
          <div className="p-4 border-2 border-dashed border-blue-200 rounded-2xl mb-4 bg-white flex flex-col items-center text-center">
            <div className="relative p-2 bg-white rounded-xl shadow-inner border border-slate-200 mb-2">
              <i className="fa-solid fa-qrcode text-7xl text-slate-800"></i>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-700">Scan QRIS Nasional (NMID: ID1020039201)</p>
              <p className="text-[11px] text-slate-500">Mendukung BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay & DANA</p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
              <i className="fa-solid fa-circle-check"></i> Siap terima pembayaran instan
            </div>
          </div>
        )}

        {paymentMethod === 'Tunai' && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Jumlah Uang Diterima dari Pelanggan:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                <input
                  type="number"
                  value={cashAmount || ''}
                  onChange={(e) => setCashAmount(Number(e.target.value) || 0)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Quick Denomination Chips */}
            <div className="flex flex-wrap gap-1.5">
              {quickNominals.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCashAmount(item.value)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition ${
                    cashAmount === item.value
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label === 'Uang Pas' ? 'Uang Pas' : `Rp ${item.value.toLocaleString('id-ID')}`}
                </button>
              ))}
            </div>

            {/* Change Result */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-500 block">Kembalian:</span>
                {isCashInsufficient ? (
                  <span className="text-rose-600 font-semibold text-[11px]">Uang diterima masih kurang!</span>
                ) : (
                  <span className="text-base font-bold text-emerald-700">
                    Rp {change.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Status Kasir:</span>
                <p className="font-bold text-slate-700">Cash Drawer 01</p>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'Transfer' && (
          <div className="space-y-2 mb-4">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-slate-800">BCA - Rekening Bengkel</p>
                <p className="font-mono text-slate-600">827-019-4820</p>
                <p className="text-[10px] text-slate-400">a.n. PT QU TEKNOLOGI BENGKEL</p>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText('8270194820')}
                className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-100 text-slate-700"
              >
                Salin No. Rek
              </button>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-slate-800">Mandiri - Rekening Operasional</p>
                <p className="font-mono text-slate-600">137-00-1928374-1</p>
                <p className="text-[10px] text-slate-400">a.n. PT QU TEKNOLOGI BENGKEL</p>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText('1370019283741')}
                className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-100 text-slate-700"
              >
                Salin No. Rek
              </button>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            disabled={isCashInsufficient}
            onClick={handleSubmit}
            className={`w-full font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg ${
              isCashInsufficient
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
            }`}
          >
            <i className="fa-solid fa-check-circle text-base"></i>
            <span>Selesaikan & Terbitkan Nota ({paymentMethod})</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-slate-500 hover:text-slate-700 py-1.5 text-xs font-semibold"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
