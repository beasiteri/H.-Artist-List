import axios from 'axios';
import { ApiResponse, FetchArtistsParams } from '@/app/services/interfaces'

const API_URL = 'https://exam.api.fotex.net/api/artists';

export const fetchArtists = async (params: FetchArtistsParams) => {
  const response = await axios.get<ApiResponse>(API_URL, { params });
  return response.data;
}
