// Firebase Firestore operations for RV sites
import { db } from './config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { RVSite, Booking, PricingRule, Coupon, SiteSettings } from '@/types';

// Convert Firestore timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return timestamp;
};

// Sites Collection Operations
export const getSites = async (): Promise<RVSite[]> => {
  const sitesRef = collection(db, 'sites');
  const q = query(sitesRef, orderBy('siteNumber', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: timestampToDate(doc.data().createdAt),
    updatedAt: timestampToDate(doc.data().updatedAt),
  })) as RVSite[];
};

export const getActiveSites = async (): Promise<RVSite[]> => {
  const sitesRef = collection(db, 'sites');
  const q = query(
    sitesRef, 
    where('status', '==', 'active'),
    orderBy('siteNumber', 'asc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: timestampToDate(doc.data().createdAt),
    updatedAt: timestampToDate(doc.data().updatedAt),
  })) as RVSite[];
};

export const getSiteById = async (siteId: string): Promise<RVSite | null> => {
  const siteRef = doc(db, 'sites', siteId);
  const snapshot = await getDoc(siteRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: timestampToDate(snapshot.data().createdAt),
    updatedAt: timestampToDate(snapshot.data().updatedAt),
  } as RVSite;
};

export const getSiteBySiteNumber = async (siteNumber: number): Promise<RVSite | null> => {
  const sitesRef = collection(db, 'sites');
  const q = query(sitesRef, where('siteNumber', '==', siteNumber));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: timestampToDate(doc.data().createdAt),
    updatedAt: timestampToDate(doc.data().updatedAt),
  } as RVSite;
};

// Bookings Collection Operations
export const getBookingsForSite = async (
  siteId: string, 
  startDate?: Date, 
  endDate?: Date
): Promise<Booking[]> => {
  const bookingsRef = collection(db, 'bookings');
  let q = query(
    bookingsRef,
    where('siteId', '==', siteId),
    where('status', 'in', ['approved', 'confirmed'])
  );
  
  const snapshot = await getDocs(q);
  
  let bookings = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    checkIn: timestampToDate(doc.data().checkIn),
    checkOut: timestampToDate(doc.data().checkOut),
    createdAt: timestampToDate(doc.data().createdAt),
    updatedAt: timestampToDate(doc.data().updatedAt),
  })) as Booking[];
  
  // Filter by date range if provided
  if (startDate && endDate) {
    bookings = bookings.filter(booking => {
      const bookingStart = booking.checkIn.getTime();
      const bookingEnd = booking.checkOut.getTime();
      const rangeStart = startDate.getTime();
      const rangeEnd = endDate.getTime();
      
      // Check for any overlap
      return bookingStart < rangeEnd && bookingEnd > rangeStart;
    });
  }
  
  return bookings;
};

export const checkSiteAvailability = async (
  siteId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> => {
  const bookings = await getBookingsForSite(siteId, checkIn, checkOut);
  return bookings.length === 0;
};

// Pricing Rules Operations
export const getPricingRulesForSite = async (siteId: string): Promise<PricingRule[]> => {
  const rulesRef = collection(db, 'pricingRules');
  const q = query(
    rulesRef,
    where('siteId', 'in', [siteId, 'all']),
    where('active', '==', true),
    orderBy('priority', 'desc')
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    startDate: doc.data().startDate ? timestampToDate(doc.data().startDate) : undefined,
    endDate: doc.data().endDate ? timestampToDate(doc.data().endDate) : undefined,
    createdAt: timestampToDate(doc.data().createdAt),
  })) as PricingRule[];
};

// Calculate pricing for a booking
export const calculateBookingPrice = async (
  siteId: string,
  checkIn: Date,
  checkOut: Date,
  couponCode?: string
): Promise<{
  subtotal: number;
  discount: number;
  discountReason?: string;
  tax: number;
  total: number;
  depositAmount: number;
  remainingBalance: number;
}> => {
  // Get site base price
  const site = await getSiteById(siteId);
  if (!site) {
    throw new Error('Site not found');
  }
  
  // Calculate number of nights
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  // Get pricing rules
  const rules = await getPricingRulesForSite(siteId);
  
  // Start with base price
  let pricePerNight = site.basePrice;
  let discountPercentage = 0;
  let discountReasons: string[] = [];
  
  // Apply pricing rules (highest priority first)
  for (const rule of rules) {
    let applies = false;
    
    // Check if rule applies to this booking
    if (rule.type === 'seasonal' && rule.startDate && rule.endDate) {
      if (checkIn >= rule.startDate && checkIn <= rule.endDate) {
        applies = true;
      }
    } else if (rule.type === 'length-of-stay' && rule.minimumNights) {
      if (nights >= rule.minimumNights) {
        applies = true;
      }
    } else if (rule.type === 'day-of-week' && rule.daysOfWeek) {
      const dayOfWeek = checkIn.getDay();
      if (rule.daysOfWeek.includes(dayOfWeek)) {
        applies = true;
      }
    }
    
    if (applies) {
      if (rule.priceOverride) {
        pricePerNight = rule.priceOverride;
        discountReasons.push(rule.name);
      } else if (rule.discountPercentage) {
        discountPercentage += rule.discountPercentage;
        discountReasons.push(rule.name);
      }
    }
  }
  
  // Calculate subtotal
  let subtotal = pricePerNight * nights;
  
  // Apply discount percentage
  let discount = (subtotal * discountPercentage) / 100;
  
  // Apply coupon if provided
  if (couponCode) {
    const coupon = await validateCoupon(couponCode, nights);
    if (coupon) {
      if (coupon.type === 'percentage') {
        const couponDiscount = (subtotal * coupon.value) / 100;
        discount += couponDiscount;
        discountReasons.push(`Coupon ${couponCode}`);
      } else {
        discount += coupon.value;
        discountReasons.push(`Coupon ${couponCode}`);
      }
    }
  }
  
  // Get settings for tax rate and deposit percentage
  const settings = await getSiteSettings();
  const taxRate = settings?.taxRate || 0;
  const depositPercentage = settings?.depositPercentage || 50;
  
  // Calculate final amounts
  const afterDiscount = subtotal - discount;
  const tax = (afterDiscount * taxRate) / 100;
  const total = afterDiscount + tax;
  const depositAmount = (total * depositPercentage) / 100;
  const remainingBalance = total - depositAmount;
  
  return {
    subtotal,
    discount,
    discountReason: discountReasons.join(', '),
    tax,
    total,
    depositAmount: Math.round(depositAmount * 100) / 100,
    remainingBalance: Math.round(remainingBalance * 100) / 100,
  };
};

// Coupon Operations
export const validateCoupon = async (
  code: string,
  minimumNights?: number
): Promise<Coupon | null> => {
  const couponsRef = collection(db, 'coupons');
  const q = query(
    couponsRef,
    where('code', '==', code.toUpperCase()),
    where('active', '==', true)
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  const couponData = snapshot.docs[0].data();
  const coupon = {
    id: snapshot.docs[0].id,
    ...couponData,
    validFrom: timestampToDate(couponData.validFrom),
    validUntil: timestampToDate(couponData.validUntil),
    createdAt: timestampToDate(couponData.createdAt),
  } as Coupon;
  
  // Check validity dates
  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    return null;
  }
  
  // Check usage limit
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return null;
  }
  
  // Check minimum stay
  if (coupon.minimumStay && minimumNights && minimumNights < coupon.minimumStay) {
    return null;
  }
  
  return coupon;
};

// Settings Operations
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  const settingsRef = doc(db, 'settings', 'settings');
  const snapshot = await getDoc(settingsRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return {
    id: 'settings',
    ...snapshot.data(),
    updatedAt: timestampToDate(snapshot.data().updatedAt),
  } as SiteSettings;
};

// Create a new booking
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const bookingsRef = collection(db, 'bookings');
  const docRef = await addDoc(bookingsRef, {
    ...bookingData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  
  return docRef.id;
};
