import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Artists } from "./Artists";
import { fetchArtists } from "../services/api";
import { ApiResponse } from "../services/interfaces";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../services/api", () => ({
  fetchArtists: jest.fn(),
}));

const mockReplace = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });

const mockApiResponse: ApiResponse = {
  data: [
    { id: 1, name: "Artist 1", albumCount: 30, portrait: "https://example.com/portrait1.jpg" },
    { id: 2, name: "Artist 2", albumCount: 15, portrait: "https://example.com/portrait2.jpg" },
  ],
  pagination: {
    current_page: 1,
    total_pages: 10,
    per_page: 50,
    total_items: 500,
  },
};

describe("Artists Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchArtists as jest.Mock).mockResolvedValue(mockApiResponse);
  });

  it("fetches and displays artists", async () => {
    render(<Artists />);
    
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());

    expect(fetchArtists).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByText("Artist 1")).toBeInTheDocument();
      expect(screen.getByText("Artist 2")).toBeInTheDocument();
    });
  });

  it("updates the table when the type filter is changed", async () => {
    render(<Artists />);
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());

    const selectTrigger = await screen.findByRole("combobox");
    fireEvent.mouseDown(selectTrigger);

    await waitFor(() => {
      expect(screen.getByText("Előadó")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Előadó"));

    await waitFor(() => expect(fetchArtists).toHaveBeenCalledTimes(2));
  });

  it("updates the URL when filters are applied", async () => {
    render(<Artists />);
    
    await waitFor(() => expect(fetchArtists).toHaveBeenCalledTimes(1));

    const selectTrigger = await screen.findByRole("combobox");
    fireEvent.mouseDown(selectTrigger);

    await waitFor(() => {
      expect(screen.getByText("Előadó")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Előadó"));

    await waitFor(() => expect(fetchArtists).toHaveBeenCalledTimes(2));

    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("type=is_performer"));
  });

});
