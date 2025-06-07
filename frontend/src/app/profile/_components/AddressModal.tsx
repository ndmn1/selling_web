"use client";

import { useState, useTransition, useEffect } from "react";
import { createAddress, updateAddress } from "@/actions/user";
import { Address } from "@/types/user";
import {
  getProvinces,
  getDistrictsByProvinceId,
  getWardsByDistrictId,
} from "@/actions/location";
import { Province, District, Ward } from "@/types/location";
import SearchableSelect, { SelectOption } from "@/components/SearchableSelect";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  address?: Address | null;
}

export default function AddressModal({
  isOpen,
  onClose,
  onSuccess,
  address,
}: AddressModalProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: "",
    phoneNumber: "",
    address: "",
    ward: "",
    district: "",
    province: "",
    isDefault: false,
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Location data states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);

  // Selected IDs for API calls
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(
    null
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null
  );
  const [selectedWardId, setSelectedWardId] = useState<number | null>(null);

  // Convert location data to SelectOption format
  const provinceOptions: SelectOption[] = provinces.map((province) => ({
    value: province.code.toString(),
    label: province.name,
  }));

  const districtOptions: SelectOption[] = districts.map((district) => ({
    value: district.code.toString(),
    label: district.name,
  }));

  const wardOptions: SelectOption[] = wards.map((ward) => ({
    value: ward.code.toString(),
    label: ward.name,
  }));

  // Fetch provinces when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchProvinces = async () => {
      try {
        const provincesData = await getProvinces();
        setProvinces(provincesData);

        // If editing an address, set up the location hierarchy
        if (address?.province) {
          const province = provincesData.find(
            (p) => p.name === address.province
          );
          if (province) {
            setSelectedProvinceId(province.code);
          }
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, [isOpen, address?.province, address?.district, address?.ward]);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvinceId) {
        setDistricts([]);
        setWards([]);
        return;
      }

      setIsLoadingDistricts(true);
      try {
        const districtsData = await getDistrictsByProvinceId(
          selectedProvinceId
        );
        setDistricts(districtsData);

        // If editing an address, try to find the district ID
        if (address?.district) {
          const district = districtsData.find(
            (d) => d.name === address.district
          );
          if (district) {
            setSelectedDistrictId(district.code);
          }
        } else {
          setWards([]);
          setSelectedDistrictId(null);
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
        setDistricts([]);
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [selectedProvinceId, address?.district]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrictId) {
        setWards([]);
        return;
      }

      setIsLoadingWards(true);
      try {
        const wardsData = await getWardsByDistrictId(selectedDistrictId);
        setWards(wardsData);
        if (address?.ward) {
          const ward = wardsData.find((w) => w.name === address.ward);
          if (ward) {
            setSelectedWardId(ward.code);
          }
        } else {
          setSelectedWardId(null);
        }
      } catch (error) {
        console.error("Error fetching wards:", error);
        setWards([]);
      } finally {
        setIsLoadingWards(false);
      }
    };

    fetchWards();
  }, [selectedDistrictId, address?.ward]);

  useEffect(() => {
    if (address) {
      setFormData({
        title: address.title,
        phoneNumber: address.phoneNumber,
        address: address.address,
        ward: address.ward || "",
        district: address.district || "",
        province: address.province,
        isDefault: address.isDefault,
      });
    } else {
      setFormData({
        title: "",
        phoneNumber: "",
        address: "",
        ward: "",
        district: "",
        province: "",
        isDefault: false,
      });
      setSelectedProvinceId(null);
      setSelectedDistrictId(null);
      setSelectedWardId(null);
    }
    setMessage(null);
  }, [address, isOpen]);

  const handleProvinceChange = (provinceCode: string) => {
    const province = provinces.find((p) => p.code.toString() === provinceCode);
    if (province) {
      setSelectedProvinceId(province.code);
      setFormData((prev) => ({
        ...prev,
        province: province.name,
        district: "", // Clear district when province changes
        ward: "", // Clear ward when province changes
      }));
    } else {
      setSelectedProvinceId(null);
      setFormData((prev) => ({
        ...prev,
        province: "",
        district: "",
        ward: "",
      }));
    }
    setSelectedDistrictId(null);
    setSelectedWardId(null);
  };

  const handleDistrictChange = (districtCode: string) => {
    const district = districts.find((d) => d.code.toString() === districtCode);
    if (district) {
      setSelectedDistrictId(district.code);
      setFormData((prev) => ({
        ...prev,
        district: district.name,
        ward: "", // Clear ward when district changes
      }));
    } else {
      setSelectedDistrictId(null);
      setFormData((prev) => ({
        ...prev,
        district: "",
        ward: "",
      }));
    }
    setSelectedWardId(null);
  };

  const handleWardChange = (wardCode: string) => {
    const ward = wards.find((w) => w.code.toString() === wardCode);
    if (ward) {
      setSelectedWardId(ward.code);
      setFormData((prev) => ({
        ...prev,
        ward: ward.name,
      }));
    } else {
      setSelectedWardId(null);
      setFormData((prev) => ({
        ...prev,
        ward: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      try {
        const addressData = {
          title: formData.title,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          ward: formData.ward || undefined,
          district: formData.district || undefined,
          province: formData.province,
          isDefault: formData.isDefault,
        };

        if (address) {
          await updateAddress(address.id, addressData);
        } else {
          await createAddress(addressData);
        }

        onSuccess();
        onClose();
      } catch (error) {
        setMessage({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "Có lỗi xảy ra khi lưu địa chỉ",
        });
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 -top-[1.5rem]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {address ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhãn địa chỉ *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ví dụ: Nhà riêng, Công ty..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại *
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ cụ thể *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Số nhà, tên đường..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            {/* Province Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỉnh/Thành phố *
              </label>
              <SearchableSelect
                options={provinceOptions}
                value={selectedProvinceId?.toString() || ""}
                onChange={handleProvinceChange}
                placeholder={
                  isLoadingProvinces
                    ? "Đang tải..."
                    : "Tìm và chọn Tỉnh/Thành phố"
                }
                disabled={isLoadingProvinces}
                isLoading={isLoadingProvinces}
                className="focus:ring-orange-500"
              />
            </div>

            {/* District Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quận/Huyện
              </label>
              <SearchableSelect
                options={districtOptions}
                value={selectedDistrictId?.toString() || ""}
                onChange={handleDistrictChange}
                placeholder={
                  !selectedProvinceId
                    ? "Chọn tỉnh/thành phố trước"
                    : isLoadingDistricts
                    ? "Đang tải..."
                    : "Tìm và chọn Quận/Huyện"
                }
                disabled={!selectedProvinceId || isLoadingDistricts}
                isLoading={isLoadingDistricts}
                className="focus:ring-orange-500"
              />
            </div>

            {/* Ward Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phường/Xã
              </label>
              <SearchableSelect
                options={wardOptions}
                value={selectedWardId?.toString() || ""}
                onChange={handleWardChange}
                placeholder={
                  !selectedDistrictId
                    ? "Chọn quận/huyện trước"
                    : isLoadingWards
                    ? "Đang tải..."
                    : "Tìm và chọn Phường/Xã"
                }
                disabled={!selectedDistrictId || isLoadingWards}
                isLoading={isLoadingWards}
                className="focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opaprovince-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
