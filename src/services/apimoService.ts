// Apimo CRM API Service
// Documentation: https://apimo.net/fr/api/webservice/

const APIMO_CONFIG = {
  // Use proxy in development and Vercel serverless function in production
  baseUrl: '/api/apimo',
  agencyId: '25311',
  providerId: '4567',
  token: 'd07da6e744bb033d1299469f1f6f7334531ec05c',
};

// Apimo API Response Types
export interface ApimoProperty {
  id: number;
  reference: string;
  agency?: number;
  user?: {
    id: number;
    agency: number;
    active: boolean;
    created_at: string;
    updated_at: string;
    firstname: string;
    lastname: string;
    language: string;
    group: string;
    email: string;
    phone?: string;
    fax?: string;
    mobile?: string;
    birthday_at?: string;
    timezone?: string;
    picture?: string;
  };
  step: number;
  status: number;
  group: number;
  parent?: number;
  ranking?: number;
  category: number;
  subcategory: number;
  name?: string;
  type: number;
  subtype: number;
  agreement?: {
    type: number;
    reference: string;
    start_at: string;
    end_at: string;
  };
  block_name?: string;
  lot_reference?: string;
  cadastre_reference?: string;
  stairs_reference?: string;
  address?: string;
  address_more?: string;
  publish_address?: boolean;
  country?: string;
  region?: {
    id: number;
    name: string;
  };
  city?: {
    id: number;
    name: string;
    zipcode?: string;
  };
  district?: {
    id: number;
    name: string;
  };
  location?: number | {
    comment?: string;
    longitude: number;
    latitude: number;
    radius: number;
    altitude?: number;
  };
  longitude?: number;
  latitude?: number;
  area?: {
    unit: number;
    value: number;
    total?: number;
    weighted?: number;
  };
  rooms?: string | number;
  bedrooms?: number;
  sleeps?: number;
  price?: {
    value: number;
    max?: number;
    fees?: number;
    unit?: number;
    period?: number;
    hide?: boolean;
    inventory?: number;
    deposit?: number;
    currency?: string;
    commission?: number;
    transfer_tax?: number;
    contribution?: number;
    pension?: number;
    tenant?: number;
    vat?: boolean;
    sold?: number;
    sold_at?: string;
  };
  rates?: Array<{
    step: number;
    start_at: string;
    end_at: string;
    price: number;
    days: number;
  }>;
  residence?: {
    id?: number;
    type: number;
    fees?: number;
    period?: number;
    lots?: number;
  };
  view?: {
    type: number;
    landscape?: number[];
  };
  construction?: {
    method?: number[];
    construction_year?: number;
    construction_step?: number;
    renovation_year?: number;
  };
  floor?: {
    type: number;
    value: number;
    levels?: number;
    floors?: number;
  };
  heating?: {
    device?: number;
    access?: number;
    type?: number;
  };
  water?: {
    hot_device?: number;
    hot_access?: number;
    waste?: number;
  };
  condition?: number;
  standing?: number;
  style?: {
    name: string;
  };
  facades?: {
    name: string;
  };
  url?: string;
  availability?: string;
  available_at?: string;
  delivered_at?: string;
  activities?: number[];
  orientations?: number[];
  services?: number[];
  proximities?: number[];
  tags?: number[];
  tags_customized?: Array<{
    comment: string;
  }>;
  pictures?: Array<{
    id: number;
    rank: number;
    url: string;
    url_large?: string;
    url_small?: string;
    width_max?: number;
    height_max?: number;
    internet?: boolean;
    print?: boolean;
    panorama?: boolean;
    comments?: Array<{
      language: string;
      comment: string;
    }>;
  }>;
  medias?: Array<{
    type: string;
    value: string;
    comments?: Array<{
      language: string;
      comment: string;
    }>;
  }>;
  comments?: Array<{
    language: string;
    title?: string;
    subtitle?: string;
    hook?: string;
    comment?: string;
    comment_full?: string;
  }>;
  areas?: Array<{
    type: string | number;
    number?: string | number;
    area?: number;
    flooring?: string | number;
    floor?: {
      id?: number;
      type?: number;
      value?: number;
    };
    orientations?: number[];
    comments?: Array<{
      language: string;
      comment: string;
    }>;
  }>;
  regulations?: Array<{
    type: number;
    value?: string;
    date?: string;
  }>;
  financial?: Array<{
    type: string;
    amount: number;
    year?: number;
  }>;
  created_at: string;
  updated_at: string;
}

export interface ApimoResponse {
  total_items: number;
  timestamp: number;
  properties: ApimoProperty[];
}

// Application Property Interface
export interface Property {
  id: number;
  title: string;
  description: string;
  type: 'buy' | 'rent' | 'seasonal';
  price: number;
  location: string;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  images: string[];
  confidential?: boolean;
  featured?: boolean;
  yearBuilt?: number;
  features?: string[];
  reference?: string;
  // Additional fields from Apimo
  rooms?: number;
  city?: string;
  // Property type fields for filtering
  category?: number; // APIMO category (1=Appartement, 2=Maison, 9=Villa, etc.)
  subtype?: number; // APIMO subtype
  zipcode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  currency?: string;
  agent?: {
    name: string;
    email?: string;
    phone?: string;
    mobile?: string;
    image?: string;
  };
  areas?: Array<{
    type: string;
    number?: number;
    area?: number;
    description?: string;
  }>;
  landSurface?: number;
  condition?: number;
  standing?: number;
  orientation?: string[];
  services?: string[];
  energyRating?: string;
}

// Mapping functions
const getCategoryType = (category: number, subcategory: number): 'buy' | 'rent' | 'seasonal' => {
  // Category: 1 = Vente, 2 = Location, 3 = Viager, 4 = Saisonnière
  if (category === 1) return 'buy';
  if (category === 2) {
    // Subcategory 21 could be long-term rental
    if (subcategory === 22 || subcategory === 23) return 'seasonal';
    return 'rent';
  }
  if (category === 4) return 'seasonal';
  return 'buy';
};

const getPropertyTypeLabel = (type: number, subtype: number): string => {
  const typeMap: { [key: number]: string } = {
    1: 'Appartement',
    2: 'Maison',
    3: 'Terrain',
    4: 'Parking',
    5: 'Commerce',
    6: 'Bureau',
    7: 'Immeuble',
    8: 'Château',
    9: 'Villa',
    10: 'Loft',
  };
  
  const subtypeMap: { [key: number]: string } = {
    1: 'Studio',
    2: 'T2',
    3: 'T3',
    4: 'T4',
    5: 'T5+',
    6: 'Duplex',
    7: 'Triplex',
    8: 'Villa',
    9: 'Mas',
    10: 'Bastide',
  };

  const typeLabel = typeMap[type] || 'Propriété';
  const subtypeLabel = subtypeMap[subtype];
  
  return subtypeLabel ? `${typeLabel} ${subtypeLabel}` : typeLabel;
};

const mapApimoToProperty = (apimoProperty: ApimoProperty, language: string = 'fr', t?: any): Property => {
  // Get title directly from API (in English or French) - we'll translate it later
  const comment = apimoProperty.comments?.find(c => c.language === 'en') || 
                  apimoProperty.comments?.find(c => c.language === 'fr') || 
                  apimoProperty.comments?.[0];
  
  const title = comment?.title || getPropertyTypeLabel(apimoProperty.type, apimoProperty.subtype);
  const description = comment?.comment_full || comment?.comment || comment?.hook || '';
  
  console.log(`📋 [${apimoProperty.id}] API Title: "${title}"`);
  
  // Get location - try to translate city name if translation function is available
  let cityName = apimoProperty.city?.name || '';
  if (t && cityName) {
    const translatedCity = t(`locations.${cityName}`, { defaultValue: cityName });
    console.log(`🌍 Translating city "${cityName}" to "${translatedCity}" in language:`, language);
    cityName = translatedCity;
  }
  const zipcode = apimoProperty.city?.zipcode || '';
  const location = zipcode ? `${cityName} ${zipcode}` : cityName;
  
  // Get images
  const images = (apimoProperty.pictures || [])
    .sort((a, b) => a.rank - b.rank)
    .map(pic => pic.url)
    .filter(Boolean);
  
  // Fallback image if no pictures
  if (images.length === 0) {
    images.push('https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800');
  }
  
  // Calculate bathrooms from areas
  const bathroomAreas = apimoProperty.areas?.filter(area => 
    ['4', '5', '41'].includes(String(area.type)) // bathroom, shower room, toilet
  ) || [];
  const bathrooms = bathroomAreas.reduce((sum, area) => sum + (Number(area.number) || 1), 0);
  
  // Get number of floors/levels from floor data
  const floors = Number(apimoProperty.floor?.levels || apimoProperty.floor?.floors || 0);
  
  // Get features from services, proximities, and tags
  const features: string[] = [];
  
  // Add area-based features
  apimoProperty.areas?.forEach(area => {
    const areaComment = area.comments?.find(c => c.language === language)?.comment;
    if (areaComment) {
      features.push(areaComment);
    }
  });
  
  // Add services, orientations, etc.
  if (apimoProperty.services && apimoProperty.services.length > 0) {
    // You can map service IDs to labels here
    const servicesText = t ? t('propertyDetail.roomTypes.services') : 'services';
    features.push(`${apimoProperty.services.length} ${servicesText}`);
  }
  
  // Map area types for detailed view
  const areaTypeMap: { [key: string]: string } = {
    '1': t ? t('propertyDetail.roomTypes.bedroom') : 'Chambre',
    '2': t ? t('propertyDetail.roomTypes.living') : 'Salon',
    '3': t ? t('propertyDetail.roomTypes.kitchen') : 'Cuisine',
    '4': t ? t('propertyDetail.roomTypes.bathroom') : 'Salle de bain',
    '5': t ? t('propertyDetail.roomTypes.showerRoom') : 'Salle d\'eau',
    '6': t ? t('propertyDetail.roomTypes.parking') : 'Parking',
    '15': t ? t('propertyDetail.roomTypes.entrance') : 'Entrée',
    '20': t ? t('propertyDetail.roomTypes.lounge') : 'Séjour',
    '41': t ? t('propertyDetail.roomTypes.wc') : 'WC',
    '68': t ? t('propertyDetail.roomTypes.terrace') : 'Terrasse',
  };
  
  const typeText = t ? t('propertyDetail.roomTypes.type') : 'Type';
  
  const areas = apimoProperty.areas?.map(area => ({
    type: areaTypeMap[String(area.type)] || `${typeText} ${area.type}`,
    number: Number(area.number) || 1,
    area: area.area,
    description: area.comments?.find(c => c.language === language)?.comment || '',
  })) || [];
  
  // Get agent info
  const agent = apimoProperty.user ? {
    name: `${apimoProperty.user.firstname} ${apimoProperty.user.lastname}`,
    email: apimoProperty.user.email,
    phone: apimoProperty.user.phone,
    mobile: apimoProperty.user.mobile,
    image: apimoProperty.user.picture,
  } : undefined;
  
  return {
    id: apimoProperty.id,
    reference: apimoProperty.reference,
    title,
    description,
    type: getCategoryType(apimoProperty.category, apimoProperty.subcategory),
    category: apimoProperty.type, // APIMO type number for filtering
    subtype: apimoProperty.subtype, // APIMO subtype number
    price: apimoProperty.price?.value || 0,
    currency: apimoProperty.price?.currency || 'EUR',
    location,
    city: cityName,
    zipcode,
    country: apimoProperty.country,
    surface: apimoProperty.area?.value || 0,
    landSurface: apimoProperty.area?.total,
    rooms: Number(apimoProperty.rooms) || 0,
    bedrooms: apimoProperty.bedrooms || 0,
    bathrooms,
    floors,
    images,
    yearBuilt: apimoProperty.construction?.construction_year,
    features,
    areas,
    latitude: apimoProperty.latitude,
    longitude: apimoProperty.longitude,
    agent,
    condition: apimoProperty.condition,
    standing: apimoProperty.standing,
    featured: apimoProperty.ranking ? apimoProperty.ranking >= 4 : false,
    confidential: !apimoProperty.publish_address,
  };
};

// API Functions
class ApimoService {
  private getAuthHeader(): string {
    const credentials = `${APIMO_CONFIG.providerId}:${APIMO_CONFIG.token}`;
    return `Basic ${btoa(credentials)}`;
  }

  async getProperties(params?: {
    limit?: number;
    offset?: number;
    timestamp?: number;
    step?: number;
    status?: number;
    group?: number;
  }, t?: any, language?: string): Promise<{ properties: Property[]; total: number }> {
    try {
      console.log('🔧 apimoService.getProperties called with params:', params);
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.timestamp) queryParams.append('timestamp', params.timestamp.toString());
      if (params?.step) queryParams.append('step', params.step.toString());
      if (params?.status) queryParams.append('status', params.status.toString());
      if (params?.group) queryParams.append('group', params.group.toString());

      const url = `${APIMO_CONFIG.baseUrl}/agencies/${APIMO_CONFIG.agencyId}/properties${
        queryParams.toString() ? '?' + queryParams.toString() : ''
      }`;
      
      console.log('📍 Fetching from URL:', url);
      console.log('🌐 Environment:', process.env.NODE_ENV);
      console.log('🔑 Base URL:', APIMO_CONFIG.baseUrl);

      // The proxy/serverless function handles authentication
      const headers: HeadersInit = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      console.log('📤 Sending request...');
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`Apimo API error: ${response.status} ${response.statusText}`);
      }

      console.log('📦 Parsing response JSON...');
      const data: ApimoResponse = await response.json();
      console.log('📊 Received data:', data);
      
      console.log('🔄 Mapping properties...');
      const properties = data.properties.map(prop => mapApimoToProperty(prop, language || 'fr', t));
      
      // Translate property names for all non-English languages
      if (language && language !== 'en') {
        await this.translatePropertyNames(properties, language);
      }

      return {
        properties,
        total: data.total_items,
      };
    } catch (error) {
      console.error('💥 Error fetching properties from Apimo:', error);
      throw error;
    }
  }

  /**
   * Translate property names and descriptions using browser-side Google Translate
   */
  async translatePropertyNames(properties: Property[], targetLang: string): Promise<void> {
    try {
      const { translateBatch } = await import('./browserTranslationService');
      
      // Get all property titles and descriptions
      const titles = properties.map(prop => prop.title);
      const descriptions = properties.map(prop => prop.description);
      
      // Translate all titles and descriptions in parallel
      const [translatedTitles, translatedDescriptions] = await Promise.all([
        translateBatch(titles, targetLang, 'auto'),
        translateBatch(descriptions, targetLang, 'auto')
      ]);
      
      // Update property titles and descriptions
      let translatedTitleCount = 0;
      let translatedDescCount = 0;
      properties.forEach((prop, index) => {
        const originalTitle = prop.title;
        const translatedTitle = translatedTitles[index];
        
        if (translatedTitle && translatedTitle !== originalTitle) {
          prop.title = translatedTitle;
          translatedTitleCount++;
        }
        
        const originalDesc = prop.description;
        const translatedDesc = translatedDescriptions[index];
        
        if (translatedDesc && translatedDesc !== originalDesc) {
          prop.description = translatedDesc;
          translatedDescCount++;
        }
      });
      
      if (translatedTitleCount > 0 || translatedDescCount > 0) {
        console.log(`✅ Translated ${translatedTitleCount} property titles and ${translatedDescCount} descriptions to ${targetLang}`);
      }
    } catch (error) {
      console.error('Translation error:', error);
      // Fail gracefully - keep original names and descriptions
    }
  }

  async getPropertyById(propertyId: number, t?: any, language?: string): Promise<Property | null> {
    try {
      // Fetch all properties and find the one with matching ID
      // Note: Apimo API doesn't have a direct endpoint for single property
      // You might need to implement caching or use a different approach
      const { properties } = await this.getProperties({ limit: 1000 }, t, language);
      const property = properties.find(p => p.id === propertyId);
      return property || null;
    } catch (error) {
      console.error(`Error fetching property ${propertyId} from Apimo:`, error);
      throw error;
    }
  }
}

export const apimoService = new ApimoService();
export default apimoService;
