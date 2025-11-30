/**
 * Address interface matching the backend API response
 */
export interface Address {
  postNumber: number;
  city: string;
  street: string;
  typeCode: number;
  type: string;
  district: string;
  municipalityNumber: number;
  municipality: string;
  county: string;
}

/**
 * API response type
 */
export type AddressSearchResponse = Address[];

/**
 * Search state for address autocomplete
 */
export interface AddressSearchState {
  results: Address[];
  loading: boolean;
  error: string | null;
}

