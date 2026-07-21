export interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
  surface: string;
  bedrooms: number;
  bathrooms: number;
  type?: 'buy' | 'rent' | 'seasonal' | 'program';
  status?: string;
  description?: string;
  features?: string[];
  yearBuilt?: number;
  landSize?: string;
  reference?: string;
  mandate?: string;
  views?: number;
  favorites?: number;
  inquiries?: number;
  visitsThisMonth?: number;
  score?: number;
  isNew?: boolean;
  demandLabel?: string;
}

export interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: string;
  advisor: string;
  type?: string;
  propertyName?: string;
}

export interface Message {
  id: number;
  sender: string;
  role: string;
  content: string;
  time: string;
  unread: boolean;
  avatar?: string;
}

export interface StatItem {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  sublabel?: string;
  color?: string;
}

export interface Demand {
  id: number;
  title: string;
  criteria: string;
  location: string;
  status: 'Active' | 'En attente' | 'Terminée';
  propositions: number;
  type?: string;
  priceRange?: string;
  details?: string;
}

export interface BuyerDocument {
  id: number;
  name: string;
  status: 'Vérifié' | 'En attente' | 'Manquant' | 'Signé';
  date: string;
  statusType: 'verified' | 'pending' | 'missing' | 'signed';
}

export interface SellerDocument {
  id: number;
  name: string;
  category: string;
  property: string;
  date: string;
}

export interface SellerStat {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trend?: string;
  trendUp?: boolean;
}

export interface StatsPerProperty {
  name: string;
  visits: number;
  demands: number;
  conversion: string;
  revenue: string;
}

export interface Lease {
  id: number;
  property: string;
  tenant: string;
  startDate: string;
  endDate: string;
  rent: string;
  deposit: string;
  status: 'Actif' | 'À renouveler' | 'Terminé';
  renewableDays?: number;
}

export interface LessorRentalProperty extends Property {
  tenant?: string;
  tenantEmail?: string;
  tenantPhone?: string;
  leaseStart?: string;
  leaseEnd?: string;
  rentAmount?: string;
  depositAmount?: string;
  occupancyRate?: number;
  mandateEnd?: string;
  mandateDaysLeft?: number;
}
