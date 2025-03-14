import Image from "next/image";

export const artistColumns = [
  {
    title: "Borító",
    dataIndex: "portrait",
    key: "portrait",
    width: 90,
    render: (src: string, record: { name: string }) => src && <Image src={src} alt={record.name} style={{ width: 50, height: 50, borderRadius: 5 }} />,
  },
  { title: "Előadó", dataIndex: "name", key: "name", width: 500 },
  { title: "Albumok", dataIndex: "albumCount", key: "albumCount", width: 120 },
];
