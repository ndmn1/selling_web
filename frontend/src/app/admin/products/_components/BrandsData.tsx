import React from "react";
import BrandFilterClient from "./BrandFilterClient";
import { getBrands } from "@/actions/brand";

export default async function BrandsData() {
  const { brands } = await getBrands();
  const brandOptions = brands.map((brand) => ({
    id: brand.id,
    label: brand.name,
    value: brand.name.toLowerCase(),
  }));

  return <BrandFilterClient brandOptions={brandOptions} />;
}
