"use client";

import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress } from '@mui/material';
import { fetchArtists } from '../services/api';
import { ApiResponse } from '../services/interfaces';
import { artistColumns } from "./artistColumns";

export const Artists = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [artists, setArtists] = useState<ApiResponse ['data']>([]);
  const [pagination, setPagination] = useState<ApiResponse['pagination']  | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 50;

  useEffect(() => {
    const loadArtists = async () => {
      setLoading(true);
      try {
        const {data: artists, pagination} = await fetchArtists({ page, per_page: perPage });
        setArtists(artists);
        setPagination(pagination);
      } catch (err) {
        console.log('Error fething artists: ', err);
      } finally {
        setLoading(false);
      }
    }
    loadArtists();
  }, [page]);
  
  return (
    <>
      {loading ? 
        <CircularProgress color="secondary" /> : 
        <DataGrid
          style={{ height: "100%", width: "100%" }}
          rows={artists}
          columns={artistColumns}
          paginationMode="server"
          paginationModel={{ pageSize: perPage, page: page - 1 }}
          rowCount={pagination?.total_items || 0}
          pageSizeOptions={[perPage]}
          onPaginationModelChange={(params) => setPage(params.page + 1)}
        />
      }
    </>
  );
}