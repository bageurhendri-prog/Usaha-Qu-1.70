export type ModuleKey = 'bengkel' | 'kedai' | 'klinik' | 'ritel' | 'titip';

export type LayoutType = 'grid' | 'sidebar' | 'navbar';

export interface ModuleConfig {
  key: ModuleKey;
  name: string;
  layout: LayoutType;
  theme: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  description: string;
}

export interface CartItem {
  id: string | number;
  name: string;
  qty: number;
  price: number;
  type: 'sparepart' | 'jasa' | 'product';
  code?: string;
  note?: string;
  warranty?: string;
}

export interface CatalogItem {
  id: string;
  code: string;
  name: string;
  category: 'oli' | 'jasa' | 'rem' | 'kelistrikan' | 'mesin' | 'perawatan' | 'lainnya';
  type: 'sparepart' | 'jasa';
  price: number;
  stock?: number;
  unit: string;
  icon: string;
  description?: string;
}

export interface CustomerVehicleInfo {
  name: string;
  phone: string;
  plate: string;
  vehicleModel: string;
  odometer: string;
  mechanic: string;
  spkNumber: string;
  entryDate: string;
  serviceStatus: 'Menunggu' | 'Dikerjakan' | 'Menunggu Sparepart' | 'Selesai Siap Bayar';
  complaintNote: string;
}

export interface CompletedTransaction {
  id: string;
  spkNumber: string;
  module: ModuleKey;
  customerName: string;
  plate?: string;
  items: CartItem[];
  subtotalPart: number;
  subtotalJasa: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'QRIS' | 'Tunai' | 'Transfer';
  amountPaid: number;
  change: number;
  timestamp: string;
}
