import { FilterOutlined } from "@ant-design/icons";
import { Input, Button, TableColumnsType } from "antd";
import Image from "next/image";
import type { InputRef } from "antd";
import { Artist } from "../services/interfaces";

export const artistColumns = (
  updateURLWithFilters: (searchValue: string) => void,
  searchInput: React.RefObject<InputRef>
): TableColumnsType<Artist> => [
  {
    title: "Borító",
    dataIndex: "portrait",
    key: "portrait",
    width: 90,
    render: (src: string, record: { name: string }) =>
      src && <Image src={src} alt={record.name} width={50} height={50} />,
  },
  {
    title: "Előadók / Zeneszerzők",
    dataIndex: "name",
    key: "name",
    width: 500,
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div>
        <Input
          ref={searchInput}
          placeholder="Keresés név szerint..."
          value={typeof selectedKeys[0] === "string" ? selectedKeys[0] : ""}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => {
            confirm();
            updateURLWithFilters(typeof selectedKeys[0] === "string" ? selectedKeys[0] : "");
          }}
        />
        <Button
          className="search-filter"
          onClick={() => {
            confirm();
            updateURLWithFilters(typeof selectedKeys[0] === "string" ? selectedKeys[0] : "");
          }}
        >
          Keresés
        </Button>
        <Button
          className="clear-filter"
          onClick={() => {
            clearFilters?.();
            updateURLWithFilters("");
            confirm();
          }}
        >
          Törlés
        </Button>
      </div>
    ),
    filterIcon: (filtered) => <FilterOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => typeof value === "string" && record.name.toLowerCase().includes(value.toLowerCase()),
  },
  {
    title: "Albumok",
    dataIndex: "albumCount",
    key: "albumCount",
    width: 120,
  },
];
