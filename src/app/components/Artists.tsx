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
  const [artists, setArtists] = useState<ApiResponse["data"]>([]);
  const [page, setPage] = useState<number>(Number(searchParams.get("page")) || 1);
  const [searchText, setSearchText] = useState<string>(searchParams.get("search") || "");
  const [selectedLetter, setSelectedLetter] = useState<string>(searchParams.get("letter") || "");
  const [selectedType, setSelectedType] = useState<string>(searchParams.get("type") || "is_primary");
  const [totalItems, setTotalItems] = useState<number>(0);
  const searchInput = useRef<InputRef>(null!);

  useEffect(() => {
    const loadArtists = async () => {
      setLoading(true);
      try {
        const response = await fetchArtists({
          page,
          per_page: 50,
          include_image: true,
          search: searchText,
          letter: selectedLetter,
          type: selectedType,
        });
        setArtists(response.data);
        setTotalItems(response.pagination.total_items);
      } catch (err) {
        console.log("Error fetching artists: ", err);
      } finally {
        setLoading(false);
      }
    };
    loadArtists();
  }, [page, searchText, selectedLetter, selectedType]);

  const updateURLWithFilters = (searchValue?: string, letterValue?: string, typeValue?: string) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("per_page", "50");
    params.set("include_image", "true");
  
    if (searchValue && searchValue.trim() !== "") {
      params.set("search", searchValue);
    }
    if (letterValue && letterValue.trim() !== "") {
      params.set("letter", letterValue);
    }
    if (typeValue) {
      params.set("type", typeValue);
    }
  
    router.replace(`?${params.toString()}`);
  
    if (searchValue !== undefined) setSearchText(searchValue);
    if (letterValue !== undefined) setSelectedLetter(letterValue);
    if (typeValue !== undefined) setSelectedType(typeValue);
  };
  

  const typeOptions: Record<string, string> = {
    is_primary: "Elsődleges",
    is_composer: "Zeneszerző",
    is_performer: "Előadó",
  };  

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <Select
          value={typeOptions[selectedType] || "Elsődleges"}
          onChange={(value) => updateURLWithFilters(undefined, undefined, value)}
          allowClear
          style={{ width: 160 }}
        >
          {selectedType !== "is_primary" && <Select.Option value="is_primary">Elsődleges</Select.Option>}
          {selectedType !== "is_composer" && <Select.Option value="is_composer">Zeneszerző</Select.Option>}
          {selectedType !== "is_performer" && <Select.Option value="is_performer">Előadó</Select.Option>}
        </Select>
      </div>

      <Table
        dataSource={artists}
        columns={artistColumns((search) => updateURLWithFilters(search, selectedLetter, selectedType), searchInput)}
        rowKey={(record) => record.id}
        pagination={{
          current: page,
          pageSize: 50,
          total: totalItems,
          showSizeChanger: false,
          onChange: (newPage) => {
            setPage(newPage);
            updateURLWithFilters(searchText, selectedLetter, selectedType);
          },
        }}
        loading={loading}
      />
    </div>
  );
};
