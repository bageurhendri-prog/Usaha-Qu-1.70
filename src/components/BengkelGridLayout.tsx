import React, { useState, useMemo } from 'react';
import { CartItem, CatalogItem, CustomerVehicleInfo, ModuleConfig } from '../types/qu';
import { INITIAL_BENGKEL_CATALOG } from '../data/bengkelCatalog';

interface BengkelGridLayoutProps {
  config: ModuleConfig;
  cart: CartItem[];
  customerInfo: CustomerVehicleInfo;
  onAddToCart: (item: CatalogItem) => void;
  onAddCustomItem: (name: string, price: number, type: 'sparepart' | 'jasa') => void;
  onUpdateQty: (id: string | number, delta: number) => void;
  onRemoveItem: (id: string | number) => void;
  onUpdateItemNote: (id: string | number, note: string) => void;
  onOpenPaymentModal: () => void;
  onOpenPrintModal: () => void;
  onOpenEditCustomerModal: () => void;
  onResetSpk: () => void;
  discount: number;
  setDiscount: (val: number) => void;
  isTaxEnabled: boolean;
  setIsTaxEnabled: (val: boolean) => void;
  onUpdateStatus: (status: CustomerVehicleInfo['serviceStatus']) => void;
}

export const BengkelGridLayout: React.FC<BengkelGridLayoutProps> = ({
  config,
  cart,
  customerInfo,
  onAddToCart,
  onAddCustomItem,
  onUpdateQty,
  onRemoveItem,
  onUpdateItemNote,
  onOpenPaymentModal,
  onOpenPrintModal,
  onOpenEditCustomerModal,
  onResetSpk,
  discount,
  setDiscount,
  isTaxEnabled,
  setIsTaxEnabled,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'sparepart' | 'jasa'>('all');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState<number | ''>('');
  const [customType, setCustomType] = useState<'sparepart' | 'jasa'>('jasa');

  // Filter Catalog
  const filteredCatalog = useMemo(() => {
    return INITIAL_BENGKEL_CATALOG.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const matchType =
        selectedType === 'all' || item.type === selectedType;

      return matchSearch && matchCategory && matchType;
    });
  }, [searchTerm, selectedCategory, selectedType]);

  // Calculations
  const subtotalPart = useMemo(() => {
    return cart
      .filter((i) => i.type === 'sparepart')
      .reduce((sum, i) => sum + i.qty * i.price, 0);
  }, [cart]);

  const subtotalJasa = useMemo(() => {
    return cart
      .filter((i) => i.type === 'jasa')
      .reduce((sum, i) => sum + i.qty * i.price, 0);
  }, [cart]);

  const rawSubtotal = subtotalPart + subtotalJasa;
  const taxableAmount = Math.max(0, rawSubtotal - discount);
  const taxAmount = isTaxEnabled ? Math.round(taxableAmount * 0.11) : 0;
  const grandTotal = Math.max(0, taxableAmount + taxAmount);

  const handleAddCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customPrice || Number(customPrice) <= 0) return;
    onAddCustomItem(customName, Number(customPrice), customType);
    setCustomName('');
    setCustomPrice('');
    setShowCustomModal(false);
  };

  const getStatusColor = (status: CustomerVehicleInfo['serviceStatus']) => {
    switch (status) {
      case 'Menunggu':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Dikerjakan':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Menunggu Sparepart':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Selesai Siap Bayar':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 p-3 sm:p-4 overflow-hidden h-full">
      {/* ======================================================== */}
      {/* LEFT GRID AREA: BENGKEL POS & CATALOG (8 Columns)       */}
      {/* ======================================================== */}
      <div className="lg:col-span-8 flex flex-col h-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 overflow-hidden">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 pb-3 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm shadow-sm shadow-blue-500/20">
                <i className={`fa-solid ${config.icon}`}></i>
              </span>
              <span>Katalog Suku Cadang & Jasa Servis</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Klik item untuk memasukkan ke dalam Lembar SPK #{customerInfo.spkNumber}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
              <input
                type="text"
                placeholder="Cari part / jasa / kode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl pl-8 pr-7 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Custom Item Button */}
            <button
              onClick={() => setShowCustomModal(true)}
              className="text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-xl transition border border-blue-200 flex items-center gap-1.5 flex-shrink-0"
              title="Input Jasa atau Sparepart Manual"
            >
              <i className="fa-solid fa-plus text-[10px]"></i>
              <span className="hidden sm:inline">Jasa/Part Kustom</span>
            </button>
          </div>
        </div>

        {/* Filter Pills / Categories */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 flex-shrink-0">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 custom-scroll text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap text-[11px] flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <i className="fa-solid fa-border-all text-[10px]"></i> Semua ({INITIAL_BENGKEL_CATALOG.length})
            </button>
            <button
              onClick={() => setSelectedCategory('oli')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap text-[11px] flex items-center gap-1.5 ${
                selectedCategory === 'oli'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <i className="fa-solid fa-oil-can text-[10px]"></i> Oli & Pelumas
            </button>
            <button
              onClick={() => setSelectedCategory('jasa')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap text-[11px] flex items-center gap-1.5 ${
                selectedCategory === 'jasa'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <i className="fa-solid fa-screwdriver-wrench text-[10px]"></i> Jasa Servis
            </button>
            <button
              onClick={() => setSelectedCategory('rem')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap text-[11px] flex items-center gap-1.5 ${
                selectedCategory === 'rem'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <i className="fa-solid fa-circle-dot text-[10px]"></i> Rem & Roda
            </button>
            <button
              onClick={() => setSelectedCategory('kelistrikan')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap text-[11px] flex items-center gap-1.5 ${
                selectedCategory === 'kelistrikan'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <i className="fa-solid fa-bolt text-[10px]"></i> Kelistrikan & Aki
            </button>
            <button
              onClick={() => setSelectedCategory('mesin')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap text-[11px] flex items-center gap-1.5 ${
                selectedCategory === 'mesin'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <i className="fa-solid fa-gears text-[10px]"></i> Mesin & CVT
            </button>
            <button
              onClick={() => setSelectedCategory('perawatan')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap text-[11px] flex items-center gap-1.5 ${
                selectedCategory === 'perawatan'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <i className="fa-solid fa-spray-can text-[10px]"></i> Chemical
            </button>
          </div>

          {/* Type Toggle: All / Sparepart / Jasa */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold flex-shrink-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2 py-1 rounded transition ${
                selectedType === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedType('sparepart')}
              className={`px-2 py-1 rounded transition ${
                selectedType === 'sparepart' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Part
            </button>
            <button
              onClick={() => setSelectedType('jasa')}
              className={`px-2 py-1 rounded transition ${
                selectedType === 'jasa' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Jasa
            </button>
          </div>
        </div>

        {/* Item Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 overflow-y-auto custom-scroll pr-1 flex-1 content-start">
          {filteredCatalog.map((item) => {
            const inCart = cart.find(
              (c) => c.name === item.name || (c.code && c.code === item.code)
            );

            return (
              <div
                key={item.id}
                onClick={() => onAddToCart(item)}
                className={`group p-3 border rounded-xl hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative bg-white ${
                  inCart
                    ? 'border-blue-400 ring-1 ring-blue-400/40 bg-blue-50/20'
                    : 'border-slate-200/90 hover:border-blue-300'
                }`}
              >
                {/* Active in-cart indicator */}
                {inCart && (
                  <span className="absolute top-2 right-2 bg-blue-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                    {inCart.qty}x di SPK
                  </span>
                )}

                <div>
                  {/* Top line: Icon & Type Tag */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 transition-transform group-hover:scale-105 ${
                        item.type === 'jasa'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <div className="min-w-0 pr-6">
                      <span className="text-[9px] font-mono text-slate-400 block truncate">
                        {item.code}
                      </span>
                      <span
                        className={`text-[8px] font-bold uppercase tracking-wider px-1 py-0.2 rounded inline-block ${
                          item.type === 'jasa'
                            ? 'bg-purple-50 text-purple-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {item.type === 'jasa' ? 'LAYANAN JASA' : 'SUKU CADANG'}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h4 className="font-bold text-slate-800 text-xs leading-snug line-clamp-2 group-hover:text-blue-700 transition">
                    {item.name}
                  </h4>
                  {item.description && (
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-normal">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Bottom line: Stock & Price */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      {item.type === 'sparepart'
                        ? `Stok: ${item.stock ?? 10} ${item.unit}`
                        : 'Teknisi Siap'}
                    </span>
                    <span className="font-extrabold text-blue-700 text-xs font-mono">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-600 text-slate-600 group-hover:text-white flex items-center justify-center text-xs transition shadow-xs"
                    title="Tambah ke SPK"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredCatalog.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 flex flex-col items-center justify-center">
              <i className="fa-solid fa-box-open text-3xl mb-2 text-slate-300"></i>
              <p className="text-xs font-semibold">Tidak ditemukan item dengan kata kunci "{searchTerm}"</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                }}
                className="mt-2 text-xs text-blue-600 underline font-medium"
              >
                Reset Filter Pencarian
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT GRID AREA: SPK & KASIR POS PANEL (4 Columns)     */}
      {/* ======================================================== */}
      <div className="lg:col-span-4 flex flex-col h-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 overflow-hidden">
        {/* SPK Header */}
        <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/80 mb-3 flex-shrink-0">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <i className="fa-solid fa-receipt text-blue-600"></i>
              <span>Ringkasan Kasir / SPK</span>
            </h3>
            <p className="text-[10px] text-slate-400">{customerInfo.entryDate}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              {customerInfo.spkNumber}
            </span>
            <button
              onClick={onResetSpk}
              title="Buat SPK Baru / Reset"
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition text-xs"
            >
              <i className="fa-solid fa-arrow-rotate-left"></i>
            </button>
          </div>
        </div>

        {/* Customer & Vehicle Information Card */}
        <div className="bg-gradient-to-r from-blue-50/70 via-sky-50/40 to-slate-50 p-3 rounded-xl mb-3 text-xs border border-blue-100 flex-shrink-0">
          <div className="flex justify-between items-start mb-1.5">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Pelanggan:</span>
              <p className="font-bold text-slate-800 leading-tight flex items-center gap-1">
                <span>{customerInfo.name}</span>
                {customerInfo.phone && (
                  <span className="text-[10px] font-normal text-slate-500 font-mono">
                    ({customerInfo.phone})
                  </span>
                )}
              </p>
            </div>
            {/* Plate Number badge styled like real Indonesian vehicle plate */}
            <div className="bg-slate-900 text-yellow-300 font-mono font-bold px-2 py-0.5 rounded text-[11px] tracking-wider border border-slate-700 shadow-xs">
              {customerInfo.plate}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-blue-100/70 text-slate-600">
            <div>
              <span className="text-slate-400 block text-[9px]">Kendaraan & Odometer:</span>
              <span className="font-semibold text-slate-700 truncate block">
                {customerInfo.vehicleModel} • {customerInfo.odometer} KM
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">Mekanik / Teknisi:</span>
              <span className="font-semibold text-slate-700 truncate block">
                {customerInfo.mechanic.split('(')[0].trim()}
              </span>
            </div>
          </div>

          {customerInfo.complaintNote && (
            <div className="mt-1.5 pt-1.5 border-t border-blue-100/70 text-[10px] text-slate-500 italic">
              <i className="fa-solid fa-comment-dots text-slate-400 mr-1"></i>
              "{customerInfo.complaintNote}"
            </div>
          )}

          {/* Quick Actions for SPK Card */}
          <div className="mt-2 pt-2 border-t border-blue-100/70 flex justify-between items-center">
            {/* Status Selector */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400">Status:</span>
              <select
                value={customerInfo.serviceStatus}
                onChange={(e) => onUpdateStatus(e.target.value as any)}
                className={`text-[10px] font-bold rounded px-1.5 py-0.5 border outline-none cursor-pointer ${getStatusColor(
                  customerInfo.serviceStatus
                )}`}
              >
                <option value="Menunggu">⏳ Menunggu</option>
                <option value="Dikerjakan">🔧 Dikerjakan</option>
                <option value="Menunggu Sparepart">📦 Sparepart</option>
                <option value="Selesai Siap Bayar">✅ Siap Bayar</option>
              </select>
            </div>

            <button
              onClick={onOpenEditCustomerModal}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
            >
              <i className="fa-solid fa-pen-to-square"></i> Ubah Data
            </button>
          </div>
        </div>

        {/* Cart Items Title & Item Count */}
        <div className="flex justify-between items-center mb-1.5 px-1 flex-shrink-0">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Rincian Item SPK ({cart.reduce((sum, i) => sum + i.qty, 0)})
          </span>
          <span className="text-[10px] text-slate-400">
            {cart.filter((i) => i.type === 'sparepart').length} Part,{' '}
            {cart.filter((i) => i.type === 'jasa').length} Jasa
          </span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto custom-scroll space-y-2 mb-2 pr-1 text-xs">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <i className="fa-solid fa-cart-arrow-down text-3xl mb-2 text-slate-300"></i>
              <p className="font-semibold text-xs text-slate-600">Keranjang SPK Masih Kosong</p>
              <p className="text-[10px] text-slate-400 mt-1">
                Pilih suku cadang atau jasa servis dari katalog di sebelah kiri.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50/80 hover:bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 transition flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[8px] font-bold uppercase px-1 py-0.2 rounded font-mono ${
                          item.type === 'jasa'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {item.type === 'jasa' ? 'JASA' : 'PART'}
                      </span>
                      <p className="font-bold text-slate-800 text-xs truncate leading-snug">
                        {item.name}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Rp {item.price.toLocaleString('id-ID')} / item
                    </p>
                  </div>

                  {/* Subtotal */}
                  <span className="font-mono font-bold text-slate-900 text-xs text-right whitespace-nowrap">
                    Rp {(item.qty * item.price).toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Controls: - qty + and remove */}
                <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateQty(item.id, -1)}
                      className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                      title="Kurangi Qty"
                    >
                      <i className="fa-solid fa-minus text-[9px]"></i>
                    </button>
                    <span className="w-6 text-center font-bold font-mono text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => onUpdateQty(item.id, 1)}
                      className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                      title="Tambah Qty"
                    >
                      <i className="fa-solid fa-plus text-[9px]"></i>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const note = prompt('Catatan untuk item ini (opsional):', item.note || '');
                        if (note !== null) onUpdateItemNote(item.id, note);
                      }}
                      className="text-[10px] text-slate-400 hover:text-blue-600 flex items-center gap-1"
                      title="Tambahkan catatan keluhan / garansi part"
                    >
                      <i className="fa-solid fa-note-sticky"></i>
                      <span>{item.note ? 'Catatan ✓' : 'Catatan'}</span>
                    </button>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                      title="Hapus dari SPK"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>

                {item.note && (
                  <p className="text-[9px] text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100 italic">
                    Note: {item.note}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pricing Breakdown & Calculation */}
        <div className="border-t border-slate-200 pt-2.5 space-y-1.5 flex-shrink-0 text-xs">
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>Subtotal Suku Cadang:</span>
            <span className="font-mono font-medium text-slate-700">
              Rp {subtotalPart.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>Subtotal Jasa Servis:</span>
            <span className="font-mono font-medium text-slate-700">
              Rp {subtotalJasa.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Discount & Tax Options */}
          <div className="flex justify-between items-center text-[11px] pt-1">
            <span className="text-slate-500">Potongan Diskon:</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-400 text-[10px]">Rp</span>
              <input
                type="number"
                value={discount || ''}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-20 text-right font-mono bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-xs text-emerald-700 font-bold outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <label className="flex items-center gap-1.5 text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={isTaxEnabled}
                onChange={(e) => setIsTaxEnabled(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 text-xs"
              />
              <span>PPN 11%:</span>
            </label>
            <span className="font-mono font-medium text-slate-700">
              Rp {taxAmount.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <div>
              <span className="font-bold text-slate-800 text-sm block">Total Tagihan:</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {cart.reduce((sum, i) => sum + i.qty, 0)} Item Diproses
              </span>
            </div>
            <span className="font-mono text-xl font-black text-blue-700 tracking-tight">
              Rp {grandTotal.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Actions: Bayar & Cetak SPK */}
          <div className="grid grid-cols-5 gap-2 pt-2">
            <button
              type="button"
              onClick={onOpenPrintModal}
              disabled={cart.length === 0}
              className={`col-span-2 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                cart.length === 0
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
              title="Cetak SPK atau Nota Sementara"
            >
              <i className="fa-solid fa-print"></i>
              <span>Cetak SPK</span>
            </button>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={onOpenPaymentModal}
              className={`col-span-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg ${
                cart.length === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
              }`}
            >
              <i className="fa-solid fa-cash-register"></i>
              <span>Bayar / Kasir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Item Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-fade-in text-xs">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <i className="fa-solid fa-plus-circle text-blue-600"></i>
                <span>Tambah Item Kustom ke SPK</span>
              </h4>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleAddCustomSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tipe Item:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomType('jasa')}
                    className={`py-1.5 rounded-lg border font-bold text-center ${
                      customType === 'jasa'
                        ? 'bg-purple-100 border-purple-300 text-purple-800'
                        : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    🔧 Layanan Jasa
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomType('sparepart')}
                    className={`py-1.5 rounded-lg border font-bold text-center ${
                      customType === 'sparepart'
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    📦 Sparepart
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Jasa / Suku Cadang:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Las Knalpot Patah / Baut Khusus"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Biaya / Harga Satuan (Rp):</label>
                <input
                  type="number"
                  required
                  min="1000"
                  placeholder="Contoh: 35000"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-1.5 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Tambahkan ke SPK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
