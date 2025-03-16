import { SearchOutlined } from "@ant-design/icons";
import { Input, Button, TableColumnsType } from "antd";
import { sortByName } from "../utils/utility";
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
      src && <Image src={src} alt={record.name} width={50} height={50} style={{ borderRadius: 5 }} />,
  },
  {
    title: "Előadó",
    dataIndex: "name",
    key: "name",
    width: 500,
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder="Keresés név szerint..."
          value={typeof selectedKeys[0] === "string" ? selectedKeys[0] : ""}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => {
            confirm();
            updateURLWithFilters(typeof selectedKeys[0] === "string" ? selectedKeys[0] : "");
          }}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => {
            confirm();
            updateURLWithFilters(typeof selectedKeys[0] === "string" ? selectedKeys[0] : "");
          }}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Keresés
        </Button>
        <Button
          onClick={() => {
            clearFilters?.();
            updateURLWithFilters("");
            confirm();
          }}
          size="small"
          style={{ width: 90 }}
        >
          Törlés
        </Button>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => typeof value === "string" && record.name.toLowerCase().includes(value.toLowerCase()),
  },
  {
    title: "Albumok",
    dataIndex: "albumCount",
    key: "albumCount",
    width: 120,
    sorter: (a, b) => a.albumCount - b.albumCount,
  },
];
