import { artistColumns } from "./artistColumns";
import { render, fireEvent } from "@testing-library/react";
import { InputRef } from "antd";

describe("artistColumns", () => {
  const mockUpdateURLWithFilters = jest.fn();
  const mockSearchInput = { current: null as InputRef | null } as React.RefObject<InputRef>;

  it("renders the columns", () => {
    const columns = artistColumns(mockUpdateURLWithFilters, mockSearchInput, true, "");

    expect(columns).toHaveLength(3);
    expect(columns[0].title).toBe("Borító");
    expect(columns[1].title).toBe("Előadók / Zeneszerzők");
    expect(columns[2].title).toBe("Albumok");
  });

  it("renders the filter dropdown for 'Előadók / Zeneszerzők'", () => {
    const columns = artistColumns(mockUpdateURLWithFilters, mockSearchInput, true, "");
    const filterDropdown = columns[1].filterDropdown;

    if (typeof filterDropdown === "function") {
      const { getByPlaceholderText, getByText } = render(
        filterDropdown({
          setSelectedKeys: jest.fn(),
          selectedKeys: [],
          confirm: jest.fn(),
          clearFilters: jest.fn(),
          prefixCls: "ant-dropdown",
          close: jest.fn(),
          visible: true,
        })
      );

      expect(getByPlaceholderText("Keresés név szerint...")).toBeInTheDocument();
      expect(getByText("Keresés")).toBeInTheDocument();
      expect(getByText("Törlés")).toBeInTheDocument();
    } else {
      throw new Error("filterDropdown is not a function");
    }
  });

  it("calls updateURLWithFilters when the search button is clicked", () => {
    const columns = artistColumns(mockUpdateURLWithFilters, mockSearchInput, true, "");
    const filterDropdown = columns[1].filterDropdown;

    if (typeof filterDropdown === "function") {
      const { getByText } = render(
        filterDropdown({
          setSelectedKeys: jest.fn(),
          selectedKeys: ["Artist 1"],
          confirm: jest.fn(),
          clearFilters: jest.fn(),
          prefixCls: "ant-dropdown",
          close: jest.fn(),
          visible: true,
        })
      );

      fireEvent.click(getByText("Keresés"));
      expect(mockUpdateURLWithFilters).toHaveBeenCalledWith("Artist 1");
    } else {
      throw new Error("filterDropdown is not a function");
    }
  });

  it("calls updateURLWithFilters with an empty string when the clear button is clicked", () => {
    const columns = artistColumns(mockUpdateURLWithFilters, mockSearchInput, true, "");
    const filterDropdown = columns[1].filterDropdown;

    if (typeof filterDropdown === "function") {
      const { getByText } = render(
        filterDropdown({
          setSelectedKeys: jest.fn(),
          selectedKeys: ["Artist 1"],
          confirm: jest.fn(),
          clearFilters: jest.fn(),
          prefixCls: "ant-dropdown",
          close: jest.fn(),
          visible: true,
        })
      );

      fireEvent.click(getByText("Törlés"));
      expect(mockUpdateURLWithFilters).toHaveBeenCalledWith("");
    } else {
      throw new Error("filterDropdown is not a function");
    }
  });
});