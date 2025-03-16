"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table, InputRef, Select } from "antd";
import { fetchArtists } from "../services/api";
import { ApiResponse } from "../services/interfaces";
import { artistColumns } from "./artistColumns";

export const Artists = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [allArtists, setAllArtists] = useState<ApiResponse["data"]>([]);
  const [displayedArtists, setDisplayedArtists] = useState<ApiResponse["data"]>([]);
  const [page, setPage] = useState<number>(Number(searchParams.get("page")) || 1);
  const [searchText, setSearchText] = useState<string>(searchParams.get("search") || "");
  const [selectedLetter, setSelectedLetter] = useState<string>(searchParams.get("letter") || "");
  const [selectedType, setSelectedType] = useState<string>(searchParams.get("type") || "is_primary");
  const [totalItems, setTotalItems] = useState<number>(0);
  const searchInput = useRef<InputRef>(null!);

  useEffect(() => {
    const loadArtists = async () => {
      setLoading(true);

      setPage(1);
    updateURLWithFilters(searchText, selectedLetter, selectedType, 1);


      try {
        const response = await fetchArtists({
          page: 1,
          per_page: 700,
          include_image: true,
          search: searchText,
          letter: selectedLetter,
          type: selectedType,
        });
        setAllArtists(response.data);
        setDisplayedArtists(response.data.slice(0, 50));
        setTotalItems(response.pagination.total_items);
      } catch (err) {
        console.log("Error fetching artists: ", err);
      } finally {
        setLoading(false);
      }
    };
    loadArtists();
  }, [searchText, selectedLetter, selectedType]);

  const updateURLWithFilters = (
    searchValue?: string,
    letterValue?: string,
    typeValue?: string,
    pageValue?: number
  ) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", (pageValue || page).toString());
    params.set("per_page", "50");
    params.set("include_image", "true");
  
    if (searchValue && searchValue.trim() !== "") {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
  
    if (letterValue && letterValue.trim() !== "") {
      params.set("letter", letterValue);
    } else {
      params.delete("letter");
    }
  
    if (typeValue) {
      params.set("type", typeValue);
    } else {
      params.delete("type");
    }
  
    router.replace(`?${params.toString()}`);
  
    if (searchValue !== undefined) setSearchText(searchValue);
    if (letterValue !== undefined) setSelectedLetter(letterValue);
    if (typeValue !== undefined) setSelectedType(typeValue);
    if (pageValue !== undefined) setPage(pageValue);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      const sortedData = [...allArtists].sort((a, b) => {
        const aValue = a[sorter.field];
        const bValue = b[sorter.field];
        if (aValue < bValue) return sorter.order === "ascend" ? -1 : 1;
        if (aValue > bValue) return sorter.order === "ascend" ? 1 : -1;
        return 0;
      });
      setDisplayedArtists(sortedData.slice((pagination.current - 1) * 50, pagination.current * 50));
    } else {
      setDisplayedArtists(allArtists.slice((pagination.current - 1) * 50, pagination.current * 50));
    }
  };

  const typeOptions: Record<string, string> = {
    is_primary: "Elsődleges",
    is_composer: "Zeneszerző",
    is_performer: "Előadó",
  };

  const fetchArtistsForPage = async (newPage: number) => {
    setLoading(true);
    try {
      const response = await fetchArtists({
        page: newPage,
        per_page: 50,
        include_image: true,
        search: searchText,
        letter: selectedLetter,
        type: selectedType,
      });
      setAllArtists(response.data);
      setDisplayedArtists(response.data.slice(0, 50));
      setTotalItems(response.pagination.total_items);
      updateURLWithFilters(searchText, selectedLetter, selectedType, newPage);
    } catch (err) {
      console.log("Error fetching artists: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <Select
          value={typeOptions[selectedType] || "Elsődleges"}
          onChange={(value) => updateURLWithFilters(undefined, undefined, value)}
          style={{ width: 160 }}
        >
          {selectedType !== "is_primary" && <Select.Option value="is_primary">Elsődleges</Select.Option>}
          {selectedType !== "is_composer" && <Select.Option value="is_composer">Zeneszerző</Select.Option>}
          {selectedType !== "is_performer" && <Select.Option value="is_performer">Előadó</Select.Option>}
        </Select>
      </div>

      <Table
        dataSource={displayedArtists}
        columns={artistColumns((search) => updateURLWithFilters(search, selectedLetter, selectedType), searchInput)}
        rowKey={(record) => record.id}
        pagination={{
          current: page,
          pageSize: 50,
          total: totalItems,
          showSizeChanger: false,
          onChange: (newPage) => {
            setPage(newPage);
            fetchArtistsForPage(newPage);
          },
        }}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};