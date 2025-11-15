// Type definitions for the entire application

export interface RVSite {
  id: string;
  name: string;
  siteNumber: number;
  type: 'rv' | 'airbnb'; // Type of site
  description: string;
  amenities: string[];
  images: string[]; // Array of image URLs
  basePrice: number; // Per night base price
  status: 'active' | 'inactive' | 'maintenance';
  maxOccupancy: number; // Maximum number of guests
  features: string[]; // Array of feature descriptions
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  siteId: string;
  siteName: string;
  guestInfo: GuestInfo;
  checkIn: Date;
  checkOut: Date;
  numberOfNights: number;
  numberOfGuests: number;
  rvDetails?: RVDetails;
  pricing: BookingPricing;
  status: 'pending' | 'approved' | 'rejected' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'deposit_paid' | 'fully_paid' | 'refunded';
  paymentIntentId?: string;
  couponCode?: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string; // Can be detailed object or simple string
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface RVDetails {
  make?: string;
  model?: string;
  length?: number; // In feet
  licensePlate?: string;
}

export interface BookingPricing {
  subtotal: number;
  discount: number;
  discountReason?: string; // e.g., "Long stay discount", "Seasonal rate", "Coupon SAVE20"
  tax: number;
  total: number;
  depositAmount: number;
  depositPaid?: boolean;
  remainingBalance: number;
}

export interface PricingRule {
  id: string;
  siteId: string; // 'all' for global rules
  name: string;
  type: 'seasonal' | 'length-of-stay' | 'day-of-week' | 'custom';
  startDate?: Date;
  endDate?: Date;
  minimumNights?: number;
  discountPercentage?: number;
  priceOverride?: number; // Absolute price per night
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  priority: number; // Higher number = higher priority
  active: boolean;
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number; // Percentage (0-100) or fixed dollar amount
  minimumStay?: number; // Minimum nights required
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  createdAt: Date;
}

export interface SiteSettings {
  id: 'settings'; // Single document
  depositPercentage: number; // Default 50
  cancellationPolicy: {
    enabled: boolean;
    daysBeforeCheckIn: number;
    refundPercentage: number; // 0-100
    customText: string;
  };
  taxRate: number; // Percentage
  notifications: {
    showPendingCount: boolean;
    emailOnNewBooking: boolean;
    emailOnCancellation: boolean;
  };
  airbnbEnabled: boolean;
  maintenanceMode: boolean;
  bookingLeadTime: number; // Minimum days in advance
  checkInTime: string; // e.g., "14:00"
  checkOutTime: string; // e.g., "11:00"
  updatedAt: Date;
  updatedBy: string;
}

export interface Activity {
  id: string;
  name: string;
  category: 'attraction' | 'outdoor' | 'dining' | 'shopping' | 'nightlife' | 'other';
  description: string;
  shortDescription: string;
  imageUrl: string;
  distance: number; // Miles from resort
  estimatedDuration: string; // e.g., "2-3 hours"
  website?: string;
  address?: string;
  phone?: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$' | 'free';
  highlights: string[];
  recommended: boolean;
  order: number;
  active: boolean;
  createdAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt: Date;
  respondedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'owner' | 'guest';
  createdAt: Date;
  lastLogin: Date;
}

export interface RevenueReport {
  totalBookings: number;
  totalRevenue: number;
  depositsCollected: number;
  pendingDeposits: number;
  averageBookingValue: number;
  occupancyRate: number;
  bookingsByStatus: Record<Booking['status'], number>;
  bookingsBySite: Record<string, number>;
  topBookingMonths: Array<{ month: string; count: number; revenue: number }>;
}
