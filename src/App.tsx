import React, { useState } from 'react';
import {
  CartItem,
  CatalogItem,
  CustomerVehicleInfo,
  ModuleConfig,
  ModuleKey,
} from './types/qu';
import { BengkelGridLayout } from './components/BengkelGridLayout';
import { KedaiSidebarLayout } from './components/KedaiSidebarLayout';
import { KlinikSidebarLayout } from './components/KlinikSidebarLayout';
import { RitelNavbarLayout } from './components/RitelNavbarLayout';
import { TitipNavbarLayout } from './components/TitipNavbarLayout';
import { PaymentModal } from './components/PaymentModal';
import { PrintSpkModal } from './components/PrintSpkModal';
import { EditCustomerModal } from './components/EditCustomerModal';

// 1. CONFIGURATION DATABASE MODUL & LAYOUT (Preserved from master)
const MODULES_CONFIG: Record<ModuleKey, ModuleConfig> = {
  bengkel: {
    key: 'bengkel',
    name: 'BengkelQu',
    layout: 'grid',
    theme: 'bengkel',
    icon: 'fa-wrench',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    bgColor: 'bg-sky-50/50',
    description: 'Modul Manajemen Bengkel & Kasir SPK (Grid Layout)',
  },
  kedai: {
    key: 'kedai',
    name: 'KedaiQu',
    layout: 'sidebar',
    theme: 'kedai',
    icon: 'fa-mug-hot',
    primaryColor: '#b45309',
    secondaryColor: '#f59e0b',
    bgColor: 'bg-amber-50/40',
    description: 'Modul Resto & Coffee Shop POS (Sidebar Layout)',
  },
  klinik: {
    key: 'klinik',
    name: 'KlinikQu',
    layout: 'sidebar',
    theme: 'klinik',
    icon: 'fa-stethoscope',
    primaryColor: '#047857',
    secondaryColor: '#10b981',
    bgColor: 'bg-emerald-50/40',
    description: 'Modul Poli & Farmasi Klinik Pratama (Sidebar Layout)',
  },
  ritel: {
    key: 'ritel',
    name: 'RitelQu',
    layout: 'navbar',
    theme: 'ritel',
    icon: 'fa-shopping-cart',
    primaryColor: '#4338ca',
    secondaryColor: '#6366f1',
    bgColor: 'bg-indigo-50/40',
    description: 'Modul Minimarket & Toko Ritel (Navbar Layout)',
  },
  titip: {
    key: 'titip',
    name: 'TitipQu',
    layout: 'navbar',
    theme: 'titip',
    icon: 'fa-box-open',
    primaryColor: '#0f766e',
    secondaryColor: '#14b8a6',
    bgColor: 'bg-teal-50/40',
    description: 'Modul Drop-point & Penitipan Paket (Navbar Layout)',
  },
};

export default function App() {
  // Current active module
  const [currentModuleKey, setCurrentModuleKey] = useState<ModuleKey>('bengkel');

  // Shared Cart State across ecosystem
  const [sharedCart, setSharedCart] = useState<CartItem[]>([
    {
      id: 'init-1',
      code: 'OLI-SYN-10W40',
      name: 'Oli Mesin Synth 10W-40 1L',
      qty: 1,
      price: 85000,
      type: 'sparepart',
      note: 'Oli lama diserahkan ke pelanggan',
    },
    {
      id: 'init-2',
      code: 'JSA-SRV-RUTIN',
      name: 'Servis Rutin / Ringan Berkala',
      qty: 1,
      price: 45000,
      type: 'jasa',
      note: 'Pembersihan filter & cek kampas rem',
    },
  ]);

  // Customer & Vehicle State
  const [customerInfo, setCustomerInfo] = useState<CustomerVehicleInfo>({
    name: 'Bpk. Hendriana',
    phone: '0812-3456-7890',
    plate: 'B 1234 TJR',
    vehicleModel: 'Honda Vario 160 ABS (2023)',
    odometer: '24.500',
    mechanic: 'Mas Agus (Bay 1 - Senior Mekanik)',
    spkNumber: '#SPK-2026-0921',
    entryDate: '14 Okt 2026 • 09:30 WIB',
    serviceStatus: 'Dikerjakan',
    complaintNote: 'Tarikan gas agak berat saat tanjakan & minta cek rem depan',
  });

  // Financial adjustments
  const [discount, setDiscount] = useState<number>(0);
  const [isTaxEnabled, setIsTaxEnabled] = useState<boolean>(false);

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Payment result state for printing official invoice
  const [lastPayment, setLastPayment] = useState<{
    method: string;
    amountPaid: number;
    change: number;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const currentConfig = MODULES_CONFIG[currentModuleKey];

  // Cart operations
  const handleAddToCart = (catalogItem: CatalogItem) => {
    setSharedCart((prev) => {
      const existing = prev.find(
        (i) => i.name === catalogItem.name || (i.code && i.code === catalogItem.code)
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          code: catalogItem.code,
          name: catalogItem.name,
          qty: 1,
          price: catalogItem.price,
          type: catalogItem.type,
        },
      ];
    });
    showToast(`✓ Ditambahkan ke SPK: ${catalogItem.name}`);
  };

  const handleAddCustomItem = (name: string, price: number, type: 'sparepart' | 'jasa') => {
    const newItem: CartItem = {
      id: `custom-${Date.now()}`,
      code: type === 'jasa' ? 'JSA-CUST' : 'PRT-CUST',
      name,
      qty: 1,
      price,
      type,
    };
    setSharedCart((prev) => [...prev, newItem]);
    showToast(`✓ Item kustom ditambahkan: ${name}`);
  };

  const handleUpdateQty = (id: string | number, delta: number) => {
    setSharedCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string | number) => {
    setSharedCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Item dihapus dari SPK');
  };

  const handleUpdateItemNote = (id: string | number, note: string) => {
    setSharedCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note } : item))
    );
  };

  const handleResetSpk = () => {
    if (confirm('Buat lembar SPK baru? Keranjang saat ini akan dikosongkan.')) {
      setSharedCart([]);
      setDiscount(0);
      setIsTaxEnabled(false);
      setLastPayment(null);
      const nextSpkNum = `#SPK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setCustomerInfo((prev) => ({
        ...prev,
        spkNumber: nextSpkNum,
        entryDate: 'Hari ini • Baru Masuk',
        serviceStatus: 'Menunggu',
        complaintNote: '',
      }));
      showToast('Lembar SPK baru berhasil dibuat');
    }
  };

  // Financial calculations
  const subtotalPart = sharedCart
    .filter((i) => i.type === 'sparepart')
    .reduce((sum, i) => sum + i.qty * i.price, 0);

  const subtotalJasa = sharedCart
    .filter((i) => i.type === 'jasa')
    .reduce((sum, i) => sum + i.qty * i.price, 0);

  const rawSubtotal = subtotalPart + subtotalJasa;
  const taxableAmount = Math.max(0, rawSubtotal - discount);
  const taxAmount = isTaxEnabled ? Math.round(taxableAmount * 0.11) : 0;
  const grandTotal = Math.max(0, taxableAmount + taxAmount);

  // Process payment
  const handleProcessPayment = (
    method: 'QRIS' | 'Tunai' | 'Transfer',
    amountPaid: number,
    change: number
  ) => {
    setLastPayment({ method, amountPaid, change });
    setIsPaymentModalOpen(false);

    // Update SPK status to Selesai
    setCustomerInfo((prev) => ({
      ...prev,
      serviceStatus: 'Selesai Siap Bayar',
    }));

    showToast(`✓ Transaksi berhasil! Pembayaran via ${method} diterima.`);
    // Automatically open print modal so user can view/print official nota
    setIsPrintModalOpen(true);
  };

  return (
    <div className="bg-slate-100 text-slate-800 font-sans antialiased h-screen flex flex-col overflow-hidden select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-4 z-[999] bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <i className="fa-solid fa-circle-check text-emerald-400"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MASTER HEADER & SWITCHER ENGINE */}
      <header
        id="master-header"
        className="bg-slate-900 text-white px-3 sm:px-4 py-2.5 flex justify-between items-center z-50 shadow-md flex-shrink-0"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white font-extrabold text-base flex items-center justify-center w-9 h-9 shadow-sm shadow-blue-500/40">
            <span className="tracking-tighter">Qu</span>
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base leading-tight flex items-center gap-2">
              <span id="app-title">{currentConfig.name}</span>
              <span
                id="layout-badge"
                className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold ${
                  currentConfig.layout === 'grid'
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-400/40'
                    : currentConfig.layout === 'sidebar'
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                    : 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/40'
                }`}
              >
                {currentConfig.layout.toUpperCase()}
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Master Modul v1.65 (Ekosistem Qu)</p>
          </div>
        </div>

        {/* DROPDOWN SWITCHER MODUL (Master engine selector) */}
        <div className="flex items-center gap-2">
          <label htmlFor="module-select" className="text-xs text-slate-300 hidden sm:inline">
            <i className="fa-solid fa-sliders mr-1.5 text-blue-400"></i>Pilih Modul:
          </label>
          <select
            id="module-select"
            value={currentModuleKey}
            onChange={(e) => setCurrentModuleKey(e.target.value as ModuleKey)}
            className="bg-slate-800 text-white border border-slate-700 text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer font-medium hover:border-slate-600 transition"
          >
            <option value="bengkel">🔧 BengkelQu (Grid Layout)</option>
            <option value="kedai">☕ KedaiQu (Sidebar Layout)</option>
            <option value="klinik">🩺 KlinikQu (Sidebar Layout)</option>
            <option value="ritel">🛒 RitelQu (Navbar Layout)</option>
            <option value="titip">📦 TitipQu (Navbar Layout)</option>
          </select>
        </div>
      </header>

      {/* DYNAMIC MAIN VIEWPORT */}
      <main
        id="app-viewport"
        className={`flex-1 flex flex-col overflow-hidden relative ${currentConfig.bgColor}`}
      >
        {currentModuleKey === 'bengkel' && (
          <BengkelGridLayout
            config={currentConfig}
            cart={sharedCart}
            customerInfo={customerInfo}
            onAddToCart={handleAddToCart}
            onAddCustomItem={handleAddCustomItem}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onUpdateItemNote={handleUpdateItemNote}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
            onOpenEditCustomerModal={() => setIsEditCustomerOpen(true)}
            onResetSpk={handleResetSpk}
            discount={discount}
            setDiscount={setDiscount}
            isTaxEnabled={isTaxEnabled}
            setIsTaxEnabled={setIsTaxEnabled}
            onUpdateStatus={(newStatus) =>
              setCustomerInfo((prev) => ({ ...prev, serviceStatus: newStatus }))
            }
          />
        )}

        {currentModuleKey === 'kedai' && (
          <KedaiSidebarLayout
            config={currentConfig}
            cart={sharedCart}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          />
        )}

        {currentModuleKey === 'klinik' && (
          <KlinikSidebarLayout
            config={currentConfig}
            cart={sharedCart}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          />
        )}

        {currentModuleKey === 'ritel' && (
          <RitelNavbarLayout
            config={currentConfig}
            cart={sharedCart}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          />
        )}

        {currentModuleKey === 'titip' && (
          <TitipNavbarLayout
            config={currentConfig}
            cart={sharedCart}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          />
        )}
      </main>

      {/* SHARED PAYMENT MODAL (QRIS / CASH / TRANSFER) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={grandTotal}
        customerInfo={customerInfo}
        onProcessPayment={handleProcessPayment}
      />

      {/* SPK & KWITANSI PRINT PREVIEW MODAL */}
      <PrintSpkModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        customerInfo={customerInfo}
        items={sharedCart}
        subtotalPart={subtotalPart}
        subtotalJasa={subtotalJasa}
        discount={discount}
        tax={taxAmount}
        total={grandTotal}
        isPaid={customerInfo.serviceStatus === 'Selesai Siap Bayar'}
        paymentDetails={lastPayment || undefined}
      />

      {/* EDIT CUSTOMER & VEHICLE MODAL */}
      <EditCustomerModal
        isOpen={isEditCustomerOpen}
        onClose={() => setIsEditCustomerOpen(false)}
        customerInfo={customerInfo}
        onSave={(updated) => {
          setCustomerInfo(updated);
          showToast('Data pelanggan & kendaraan berhasil diperbarui');
        }}
      />
    </div>
  );
}
