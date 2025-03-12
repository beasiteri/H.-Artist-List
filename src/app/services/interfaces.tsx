export interface Artist {
  id: number;
  name: string;
  albumCount: number;
  portrait: string;
}
  
export interface FetchArtistsParams {
  type?: string;
  letter?: string;
  include_image?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
}
  
export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  per_page: number;
  total_items: number;
}