"use client";

import { useEffect, useState } from "react";
import { Table } from "antd";
import { fetchArtists } from "../services/api";
import { ApiResponse } from "../services/interfaces";
import { artistColumns } from "./artistColumns";

export const Artists = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [artists, setArtists] = useState<ApiResponse["data"]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const loadArtists = async (page: number) => {
      setLoading(true);
      try {
        const response = await fetchArtists({ page, per_page: pageSize });
        setArtists(response.data);
        setTotalItems(response.pagination.total_items);
      } catch (err) {
        console.log("Error fetching artists: ", err);
      } finally {
        setLoading(false);
      }
    };
    loadArtists(page);
  }, [  page, pageSize ]);

  return (
    <Table
      dataSource={artists}
      columns={artistColumns}
      rowKey={(record) => record.id}
      pagination={{
        current: page,
        pageSize: pageSize,
        total: totalItems,
        showSizeChanger: false,
        onChange: (page,pageSize) => {
          setPage(page);
          setPageSize(pageSize);
        },
      }}
      loading={loading}
    />
  );
};
