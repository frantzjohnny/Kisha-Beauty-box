
export interface Service {
  id: string;
  name: string;
  description: string;
  category?: string;
  durationMinutes: number;
  price: number;
}

export interface ShopSettings {
  shopName: string;
  phoneNumber: string; // International format without + (e.g., 17812580779)
  openingTime: string; // HH:MM
  closingTime: string; // HH:MM
  currency: string;
}

export interface BookingState {
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedTime: string | null; // HH:MM
  customerName: string;
  paymentMethod: 'Cash' | 'Zelle' | 'CashApp' | null;
}

export const INITIAL_SERVICES: Service[] = [
  // Nail Services
  { id: 'n1', name: 'Basic Manicure', description: 'Essential nail care', category: 'Nail Services', durationMinutes: 30, price: 20 },
  { id: 'n2', name: 'Gel Manicure', description: 'Long-lasting gel polish', category: 'Nail Services', durationMinutes: 45, price: 35 },
  { id: 'n3', name: 'Acrylic Full Set (Short)', description: 'Classic acrylic extensions', category: 'Nail Services', durationMinutes: 60, price: 45 },
  { id: 'n4', name: 'Acrylic Full Set (Medium)', description: 'Medium length extensions', category: 'Nail Services', durationMinutes: 75, price: 55 },
  { id: 'n5', name: 'Acrylic Full Set (Long)', description: 'Long length extensions', category: 'Nail Services', durationMinutes: 90, price: 65 },
  { id: 'n6', name: 'Acrylic Fill-In', description: 'Maintenance for acrylics', category: 'Nail Services', durationMinutes: 60, price: 35 },
  { id: 'n7', name: 'Gel X Full Set', description: 'Soft gel extensions', category: 'Nail Services', durationMinutes: 60, price: 50 },
  { id: 'n8', name: 'Freestyle Set', description: 'Creative design set (starts at $65)', category: 'Nail Services', durationMinutes: 90, price: 65 },
  { id: 'n9', name: 'Soak Off / Removal', description: 'Safe removal of product', category: 'Nail Services', durationMinutes: 30, price: 10 },
  { id: 'n10', name: 'Nail Art', description: 'Design add-on ($5-$20)', category: 'Nail Services', durationMinutes: 15, price: 5 },

  // Braiding Services
  { id: 'b1', name: '2 Feed-In Braids', description: 'Two clean feed-in braids', category: 'Braiding Services', durationMinutes: 45, price: 35 },
  { id: 'b2', name: '4 Feed-In Braids', description: 'Four clean feed-in braids', category: 'Braiding Services', durationMinutes: 60, price: 55 },
  { id: 'b3', name: 'Knotless Braids (Small)', description: 'Small parts, natural look', category: 'Braiding Services', durationMinutes: 240, price: 180 },
  { id: 'b4', name: 'Knotless Braids (Medium)', description: 'Medium parts', category: 'Braiding Services', durationMinutes: 180, price: 160 },
  { id: 'b5', name: 'Knotless Braids (Large)', description: 'Large parts, quicker style', category: 'Braiding Services', durationMinutes: 150, price: 130 },
  { id: 'b6', name: 'Box Braids (Small)', description: 'Traditional box braids, small', category: 'Braiding Services', durationMinutes: 240, price: 160 },
  { id: 'b7', name: 'Box Braids (Medium)', description: 'Traditional box braids, medium', category: 'Braiding Services', durationMinutes: 180, price: 140 },
  { id: 'b8', name: 'Box Braids (Large)', description: 'Traditional box braids, large', category: 'Braiding Services', durationMinutes: 150, price: 110 },
  { id: 'b9', name: 'Tribal Braids', description: 'Fulani/Tribal style patterns', category: 'Braiding Services', durationMinutes: 180, price: 160 },
  { id: 'b10', name: 'Boho Knotless', description: 'Knotless with curly ends', category: 'Braiding Services', durationMinutes: 240, price: 180 },
  { id: 'b11', name: 'Kids Braids', description: 'Styles for children ($45-$90)', category: 'Braiding Services', durationMinutes: 90, price: 45 },
  { id: 'b12', name: 'Take Down', description: 'Braid removal service ($20-$40)', category: 'Braiding Services', durationMinutes: 60, price: 20 },

  // Add-Ons
  { id: 'a1', name: 'Shine / Top Coat', description: 'Extra shine finish', category: 'Add-Ons & Extras', durationMinutes: 5, price: 5 },
  { id: 'a2', name: 'Cuticle Treatment', description: 'Deep cuticle care', category: 'Add-Ons & Extras', durationMinutes: 10, price: 5 },
  { id: 'a3', name: 'Nail Repair', description: 'Per nail repair', category: 'Add-Ons & Extras', durationMinutes: 10, price: 3 },
  { id: 'a4', name: 'Hair Beads', description: 'Decorative beads for braids', category: 'Add-Ons & Extras', durationMinutes: 15, price: 5 },
  { id: 'a5', name: 'Wash & Blow Dry', description: 'Pre-style wash', category: 'Add-Ons & Extras', durationMinutes: 30, price: 15 },
];

export const INITIAL_SETTINGS: ShopSettings = {
  shopName: 'KISHA BEAUTY BOX',
  phoneNumber: '17812580779',
  openingTime: '09:00',
  closingTime: '19:00',
  currency: '$'
};
