import React, { useState } from 'react';
import { CustomerVehicleInfo } from '../types/qu';

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerInfo: CustomerVehicleInfo;
  onSave: (updated: CustomerVehicleInfo) => void;
}

const MECHANIC_OPTIONS = [
  'Mas Agus (Bay 1 - Senior Mekanik)',
  'Kang Dedi (Bay 2 - Spesialis CVT & Injeksi)',
  'Bli Wayan (Bay 3 - Kelistrikan & Dinamo)',
  'Mas Fajar (Bay 4 - Servis Cepat & Oli)',
  'Belum Ditentukan (Antrean Umum)',
];

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  isOpen,
  onClose,
  customerInfo,
  onSave,
}) => {
  const [form, setForm] = useState<CustomerVehicleInfo>({ ...customerInfo });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl animate-fade-in flex flex-col max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              <i className="fa-solid fa-id-card"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Data Pelanggan & Kendaraan SPK</h3>
              <p className="text-[11px] text-slate-400">Identitas unit masuk bengkel & instruksi kerja</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: SPK & Status */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Nomor SPK:</label>
              <input
                type="text"
                value={form.spkNumber}
                onChange={(e) => setForm({ ...form, spkNumber: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono font-bold text-blue-700 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Status Pengerjaan:</label>
              <select
                value={form.serviceStatus}
                onChange={(e) => setForm({ ...form, serviceStatus: e.target.value as any })}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Menunggu">⏳ Menunggu Antrean</option>
                <option value="Dikerjakan">🔧 Sedang Dikerjakan</option>
                <option value="Menunggu Sparepart">📦 Menunggu Sparepart</option>
                <option value="Selesai Siap Bayar">✅ Selesai Siap Bayar</option>
              </select>
            </div>
          </div>

          {/* Row 2: Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Pemilik / Pelanggan:</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Contoh: Bpk. Hendriana"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nomor WhatsApp / HP:</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0812-3456-7890"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 3: Plate, Vehicle Model & KM */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className="font-semibold text-slate-700 block mb-1">Plat Nomor:</label>
              <input
                type="text"
                value={form.plate}
                onChange={(e) => setForm({ ...form, plate: e.target.value.toUpperCase() })}
                placeholder="B 1234 TJR"
                className="w-full bg-slate-900 text-yellow-300 font-mono font-black text-center tracking-wider rounded-lg px-2 py-2 uppercase border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Tipe / Model Kendaraan:</label>
              <input
                type="text"
                value={form.vehicleModel}
                onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })}
                placeholder="Honda Vario 160 ABS (2023)"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 4: Odometer & Mechanic */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Odometer (Kilometer):</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.odometer}
                  onChange={(e) => setForm({ ...form, odometer: e.target.value })}
                  placeholder="24.500"
                  className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-semibold">KM</span>
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mekanik Penanggung Jawab:</label>
              <select
                value={form.mechanic}
                onChange={(e) => setForm({ ...form, mechanic: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MECHANIC_OPTIONS.map((m, idx) => (
                  <option key={idx} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Complaints / Notes */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Keluhan / Catatan Kendaraan:</label>
            <textarea
              rows={2}
              value={form.complaintNote}
              onChange={(e) => setForm({ ...form, complaintNote: e.target.value })}
              placeholder="Contoh: Tarikan gas berat saat tanjakan, minta cek rem depan & ganti oli rutin..."
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <i className="fa-solid fa-save"></i> Simpan Data SPK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
