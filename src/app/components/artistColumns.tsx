import { GridColDef } from "@mui/x-data-grid";
import Image from "next/image";

export const artistColumns: GridColDef[] = [
  { 
    field: "portrait", 
    headerName: "Kép",
    width: 90,
    renderCell: (params) =>
      params.value && (
        <Image
          src={params.value}
          alt={params.row.name}
          width={50}
          height={50}
          style={{ borderRadius: "5px" }}
          unoptimized
        />
      )
  },
  { field: "name", headerName: "Név", width: 500 },
  { field: "albumCount", headerName: "Albumok", type: "number", width: 120 },
];