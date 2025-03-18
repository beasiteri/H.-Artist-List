import axios from "axios";
import { fetchArtists } from "./api";
import { ApiResponse } from "../services/interfaces";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchArtists", () => {
  it("fetches artists", async () => {
    const mockResponse: ApiResponse = {
      data: [{ id: 1, name: "Artist 1", albumCount: 30, portrait: "https://example.com/portrait1.jpg" }],
      pagination: {
        current_page: 1,
        total_pages: 10,
        per_page: 50,
        total_items: 500,
      },
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const params = { page: 1, per_page: 50, include_image: true };
    const result = await fetchArtists(params);

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.any(String), { params });
    expect(result).toEqual(mockResponse);
  });
});
