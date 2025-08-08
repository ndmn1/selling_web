import { getAllBrands } from "@/actions/brand";
import { RangleFilter } from "./RangeFilter";
import { SingleFilter } from "./SingleFilter";
import SideBarClient from "./FilterBarClient";
import { priceOptions, sizeOptions } from "@/constant";


export default async function SideBarServer() {
  // Fetch brands server-side
  const brands = await getAllBrands();
  
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