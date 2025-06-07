"use server";

import { Province, District, Ward } from "@/types/location";

// Vietnamese location API service using provinces.open-api.vn
const BASE_URL = "https://provinces.open-api.vn/api";



// Get all provinces in Vietnam
export async function getProvinces(): Promise<Province[]> {
  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      cache: "force-cache", // Cache since provinces don't change often
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Province[] = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw new Error("Failed to fetch provinces");
  }
}

// Get districts by province code  
export async function getDistrictsByProvinceId(provinceCode: number): Promise<District[]> {
  try {
    const response = await fetch(`${BASE_URL}/p/${provinceCode}?depth=2`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const provinceData: Province = await response.json();
    return provinceData.districts || [];
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw new Error("Failed to fetch districts");
  }
}

// Get wards by district code
export async function getWardsByDistrictId(districtCode: number): Promise<Ward[]> {
  try {
    const response = await fetch(`${BASE_URL}/d/${districtCode}?depth=2`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const districtData: District = await response.json();
    return districtData.wards || [];
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw new Error("Failed to fetch wards");
  }
}

// Helper function to find province by name (for existing data compatibility)
export async function findProvinceByName(provinceName: string): Promise<Province | null> {
  try {
    const provinces = await getProvinces();
    return provinces.find(p => 
      p.name.toLowerCase().includes(provinceName.toLowerCase()) ||
      provinceName.toLowerCase().includes(p.name.toLowerCase())
    ) || null;
  } catch (error) {
    console.error("Error finding province by name:", error);
    return null;
  }
}

// Helper function to find district by name within a province
export async function findDistrictByName(provinceCode: number, districtName: string): Promise<District | null> {
  try {
    const districts = await getDistrictsByProvinceId(provinceCode);
    return districts.find(d => 
      d.name.toLowerCase().includes(districtName.toLowerCase()) ||
      districtName.toLowerCase().includes(d.name.toLowerCase())
    ) || null;
  } catch (error) {
    console.error("Error finding district by name:", error);
    return null;
  }
}

// Helper function to find ward by name within a district
export async function findWardByName(districtCode: number, wardName: string): Promise<Ward | null> {
  try {
    const wards = await getWardsByDistrictId(districtCode);
    return wards.find(w => 
      w.name.toLowerCase().includes(wardName.toLowerCase()) ||
      wardName.toLowerCase().includes(w.name.toLowerCase())
    ) || null;
  } catch (error) {
    console.error("Error finding ward by name:", error);
    return null;
  }
}
