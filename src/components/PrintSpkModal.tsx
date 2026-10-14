import React from 'react';
import { CartItem, CustomerVehicleInfo } from '../types/qu';

interface PrintSpkModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerInfo: CustomerVehicleInfo;
  items: CartItem[];
  subtotalPart: number;
  subtotalJasa: number;
  discount: number;
  tax: number;
  total: number;
  isPaid?: boolean;
  paymentDetails?: {
    method: string;
    amountPaid: number;
    change: number;
  };
}

export const PrintSpkModal: React.FC<PrintSpkModalProps> = ({
  isOpen,
  onClose,
  customerInfo,
  items,
  subtotalPart,
  subtotalJasa,
  discount,
  tax,
  total,
  isPaid,
  paymentDetails,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-fade-in flex flex-col max-h-[95vh] overflow-y-auto print:max-w-none print:shadow-none print:p-0 print:m-0">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <i className="fa-solid fa-print"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Pratinjau SPK & Nota BengkelQu</h3>
              <p className="text-[11px] text-slate-400">Siap dicetak ke printer struk atau A4/A5</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30"
            >
              <i className="fa-solid fa-print"></i> Cetak Dokumen
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        {/* PRINTABLE SHEET */}
        <div className="bg-white text-slate-800 p-2 sm:p-4 text-xs font-sans leading-relaxed border border-slate-200 rounded-xl print:border-none">
          {/* Header Surat */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-700 text-white rounded-xl flex items-center justify-center text-xl font-black">
                Qu
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight">BENGKELQU SERVICE CENTER</h1>
                <p className="text-[10px] text-slate-600">Jl. Raya Otomotif No. 88, Sentra Servis & Suku Cadang</p>
                <p className="text-[10px] text-slate-600">Telp / WA: 0811-2233-4455 | Email: support@bengkelqu.id</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider mb-1 ${
                isPaid ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
              }`}>
                {isPaid ? 'LUNAS / NOTA RESMI' : 'SPK & ESTIMASI BIAYA'}
              </span>
              <p className="font-mono font-bold text-slate-900 text-sm">{customerInfo.spkNumber}</p>
              <p className="text-[10px] text-slate-500">{customerInfo.entryDate}</p>
            </div>
          </div>

          {/* Customer & Unit Details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg mb-4 border border-slate-200">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Identitas Pelanggan</p>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{customerInfo.name}</p>
              <p className="text-slate-600 text-xs">No. Telp/WA: {customerInfo.phone || '-'}</p>
              <p className="text-slate-600 text-xs mt-1">Mekanik PJ: <span className="font-semibold text-slate-800">{customerInfo.mechanic}</span></p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Data Kendaraan</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono bg-slate-900 text-yellow-300 px-2 py-0.5 rounded text-xs font-bold tracking-wider">
                  {customerInfo.plate}
                </span>
                <span className="font-semibold text-slate-800 text-xs">{customerInfo.vehicleModel || '-'}</span>
              </div>
              <p className="text-slate-600 text-xs mt-1">Odometer: <span className="font-mono font-semibold">{customerInfo.odometer} KM</span></p>
              {customerInfo.complaintNote && (
                <p className="text-[10px] text-slate-500 mt-1 italic">Keluhan: "{customerInfo.complaintNote}"</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse mb-4">
            <thead>
              <tr className="border-b border-slate-300 text-slate-500 text-[10px] uppercase tracking-wider bg-slate-100">
                <th className="py-2 px-2 text-center w-8">No</th>
                <th className="py-2 px-2">Deskripsi Layanan / Suku Cadang</th>
                <th className="py-2 px-2 text-center w-16">Tipe</th>
                <th className="py-2 px-2 text-center w-12">Qty</th>
                <th className="py-2 px-2 text-right w-24">Harga</th>
                <th className="py-2 px-2 text-right w-28">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item, idx) => (
                <tr key={idx} className="text-xs">
                  <td className="py-2 px-2 text-center text-slate-400">{idx + 1}</td>
                  <td className="py-2 px-2">
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    {item.code && <span className="text-[10px] font-mono text-slate-400">{item.code}</span>}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      item.type === 'jasa' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.type === 'jasa' ? 'JASA' : 'PART'}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-slate-700">{item.qty}</td>
                  <td className="py-2 px-2 text-right font-mono text-slate-600">
                    Rp {item.price.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                    Rp {(item.qty * item.price).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Summary */}
          <div className="flex justify-between items-start pt-2 border-t border-slate-200 mb-4">
            <div className="text-[11px] text-slate-500 max-w-xs space-y-1">
              <p className="font-semibold text-slate-700">Ketentuan Servis & Garansi:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                <li>Garansi pengerjaan servis 7 hari / 500 KM (mana tercapai lebih dahulu).</li>
                <li>Suku cadang elektronik/kelistrikan tidak bergaransi setelah segel dibuka.</li>
                <li>Barang bekas diganti wajib diambil saat pengambilan kendaraan.</li>
              </ul>
            </div>

            <div className="w-56 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Suku Cadang:</span>
                <span className="font-mono">Rp {subtotalPart.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Jasa Servis:</span>
                <span className="font-mono">Rp {subtotalJasa.toLocaleString('id-ID')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Diskon Promo:</span>
                  <span className="font-mono">- Rp {discount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>PPN 11%:</span>
                  <span className="font-mono">Rp {tax.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-1.5 border-t border-slate-300">
                <span>Total Biaya:</span>
                <span className="text-blue-700 font-mono text-base font-black">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>

              {isPaid && paymentDetails && (
                <div className="bg-emerald-50 p-2 rounded text-[11px] border border-emerald-200 space-y-0.5">
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Metode:</span>
                    <span>{paymentDetails.method}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800">
                    <span>Dibayar:</span>
                    <span>Rp {paymentDetails.amountPaid.toLocaleString('id-ID')}</span>
                  </div>
                  {paymentDetails.change > 0 && (
                    <div className="flex justify-between text-emerald-800">
                      <span>Kembalian:</span>
                      <span>Rp {paymentDetails.change.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Signature Columns */}
          <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-slate-200 text-xs">
            <div>
              <p className="text-slate-500 text-[10px]">Mekanik / Teknisi</p>
              <div className="h-14 flex items-end justify-center font-semibold text-slate-800">
                ( {customerInfo.mechanic.split('(')[0].trim()} )
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-[10px]">Pemilik Kendaraan</p>
              <div className="h-14 flex items-end justify-center font-semibold text-slate-800">
                ( {customerInfo.name} )
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-[10px]">Kasir / Admin</p>
              <div className="h-14 flex items-end justify-center font-semibold text-slate-800">
                ( Admin BengkelQu )
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
