"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Table, InputRef, Select, Spin } from "antd";
import { fetchArtists } from "../services/api";
import { ApiResponse } from "../services/interfaces";
import { artistColumns } from "./artistColumns";

export const Artists = () => {
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayedArtists, setDisplayedArtists] = useState<ApiResponse["data"]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("is_primary");
  const [totalItems, setTotalItems] = useState<number>(0);
  const searchInput = useRef<InputRef>(null!);

  const fetchArtistsForPage = async (newPage: number, isInitialLoad = false) => {
    if (isInitialLoad) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const params: Record<string, string | number | boolean> = {
        page: newPage,
        per_page: 50,
        include_image: true,
      };
  
      if (searchText.trim()) {
        params.search = searchText;
      }
  
      if (selectedLetter.trim()) {
        params.letter = selectedLetter;
      }
  
      if (selectedType.trim()) {
        params.type = selectedType;
      }
  
      const response = await fetchArtists(params);
      setDisplayedArtists(response.data.slice(0, 50));
      setTotalItems(response.pagination.total_items);
    } catch (err) {
      console.error("Error fetching artists:", err);
    } finally {
      if (isInitialLoad) {
        setInitialLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPage(Number(params.get("page")) || 1);
    setSearchText(params.get("search") || "");
    setSelectedLetter(params.get("letter") || "");
    setSelectedType(params.get("type") || "is_primary");

    fetchArtistsForPage(1, true);
  }, []);

  useEffect(() => {
    fetchArtistsForPage(page);
  }, [page, searchText, selectedLetter, selectedType]);

  const updateURLWithFilters = (
    searchValue?: string,
    letterValue?: string,
    typeValue?: string,
    pageValue?: number
  ) => {
    const params = new URLSearchParams(window.location.search);

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

    params.set("page", (pageValue || page).toString());
    params.set("per_page", "50");
    params.set("include_image", "true");

    router.replace(`?${params.toString()}`);

    if (searchValue !== undefined && searchValue !== searchText) setSearchText(searchValue);
    if (letterValue !== undefined && letterValue !== selectedLetter) setSelectedLetter(letterValue);
    if (typeValue !== undefined && typeValue !== selectedType) setSelectedType(typeValue);
    if (pageValue !== undefined && pageValue !== page) setPage(pageValue);
  };

  const typeOptions: Record<string, string> = {
    is_primary: "Elsődleges",
    is_composer: "Zeneszerző",
    is_performer: "Előadó",
  };

  return (
    <>
      {initialLoading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <h1>Előadók és zeneszerzők</h1>
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
          {loading ? (
            <div style={{ textAlign: "center", marginTop: 50 }}>
              <Spin size="large" />
            </div>
          ) : (
            <Table
            dataSource={displayedArtists.length > 0 ? displayedArtists : []}
              columns={artistColumns(
                (search) => updateURLWithFilters(search, selectedLetter, selectedType),
                searchInput,
                displayedArtists.length > 0
              )}
              rowKey={(record) => record.id || Math.random()}
              pagination={{
                current: page,
                pageSize: 50,
                total: totalItems,
                showSizeChanger: false,
                onChange: (newPage) => {
                  setPage(newPage);
                  updateURLWithFilters(searchText, selectedLetter, selectedType, newPage);
                },
              }}
            />
          )}
        </>
      )}
    </>
  );
};