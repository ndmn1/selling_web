import { getBrands } from "@/data/product";
import { RangleFilter } from "./RangeFilter";
import { SingleFilter } from "./SingleFilter";
import SideBarClient from "./FilterBarClient";

// Price filter options
const priceOptions = [
  { id: "price-1", label: "Giá dưới 1.000.000đ", min: 0, max: 1000000 },
  {
    id: "price-2",
    label: "1.000.000đ - 2.000.000đ",
    min: 1000000,
    max: 2000000,
  },
  {
    id: "price-3",
    label: "2.000.000đ - 3.000.000đ",
    min: 2000000,
    max: 3000000,
  },
  {
    id: "price-4",
    label: "3.000.000đ - 5.000.000đ",
    min: 3000000,
    max: 5000000,
  },
  {
    id: "price-5",
    label: "5.000.000đ - 10.000.000đ",
    min: 5000000,
    max: 10000000,
  },
];

// Size filter options
const sizeOptions = [
  { id: "35.0", label: "35.0VN", value: "35.0" },
  { id: "36.0", label: "36.0VN", value: "36.0" },
  { id: "37.0", label: "37.0VN", value: "37.0" },
  { id: "38.0", label: "38.0VN", value: "38.0" },
  { id: "39.0", label: "39.0VN", value: "39.0" },
  { id: "40.0", label: "40.0VN", value: "40.0" },
];

export default async function SideBarServer() {
  // Fetch brands server-side
  const brands = await getBrands();
  
  const brandOptions = brands.map((brand) => ({
    id: brand.id,
    label: brand.name,
    value: brand.name.toLowerCase(),
  }));

  const sidebarContent = (
    <div className="space-y-6">
      <RangleFilter title="GIÁ THÀNH" options={priceOptions} />
      <SingleFilter
        title="THƯƠNG HIỆU"
        options={brandOptions}
        searchParamName="brand"
      />
      <SingleFilter
        title="SIZE"
        options={sizeOptions}
        searchParamName="size"
      />
    </div>
  );

  return <SideBarClient sidebarContent={sidebarContent} />;
} 