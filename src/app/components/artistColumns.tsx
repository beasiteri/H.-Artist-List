import { FilterOutlined, FilterFilled } from "@ant-design/icons";
import { Input, Button, TableColumnsType } from "antd";
import Image from "next/image";
import type { InputRef } from "antd";
import { Artist } from "../services/interfaces";

export const artistColumns = (
  updateURLWithFilters: (searchValue: string) => void,
  searchInput: React.RefObject<InputRef>,
  hasData: boolean,
  searchText: string // Pass the current searchText to manage the filter icon
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
    filterDropdown: hasData
      ? ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
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
        )
      : undefined,
    filterIcon: () =>
      searchText ? (
        <FilterFilled style={{ color: "#1890ff" }} />
      ) : (
        <FilterOutlined style={{ color: "#bfbfbf" }} />
      ),
    onFilter: hasData
      ? (value, record) => typeof value === "string" && record.name.toLowerCase().includes(value.toLowerCase())
      : undefined,
  },
  {
    title: "Albumok",
    dataIndex: "albumCount",
    key: "albumCount",
    width: 120,
  },
];