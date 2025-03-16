import axios from "axios";
import { ApiResponse, FetchArtistsParams } from "@/app/services/interfaces";

const API_URL = "https://exam.api.fotex.net/api/artists";

export const fetchArtists = async (params: FetchArtistsParams) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value != null && value !== "")
  );

  const response = await axios.get<ApiResponse>(API_URL, { params: filteredParams });
  return response.data;
};
