import axios from 'axios';
import { Artist, FetchArtistsParams, PaginationInfo } from '@/app/services/interfaces'

const API_URL = 'https://exam.api.fotex.net/api/artists';

export const fetchArtists = async (params: FetchArtistsParams) => {
  const {
    type='',
    letter='',
    include_image=true,
    search='',
    page=1,
    per_page=20
  } = params;

  const response = await axios.get<{data: Artist[], pagination: PaginationInfo}>(API_URL, {
    params: { 
      type,
      letter,
      include_image,
      search,
      page,
      per_page
    }
  });

  return {
    artists: response.data.data,
    pagination: response.data.pagination,
  }
}