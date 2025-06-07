"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartSummary } from "@/context/CartSummaryProvider";
import { FaChevronDown } from "react-icons/fa";
import Image from "next/image";
import { PAYMENT_METHOD } from "@/constant";
import { getUserAddresses } from "@/actions/user";
import { Address } from "@/types/user";
import {
  getProvinces,
  getDistrictsByProvinceId,
  getWardsByDistrictId,
} from "@/actions/location";
import { Province, District, Ward } from "@/types/location";
import SearchableSelect, { SelectOption } from "@/components/SearchableSelect";

function CustomerInfo() {
  const {
    customerInfo,
    updateCustomerInfo,
    validationErrors,
    clearValidationError,
  } = useCartSummary();

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

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

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provincesData = await getProvinces();
        setProvinces(provincesData);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch saved addresses on component mount
  useEffect(() => {
    if(!provinces.length) return;
    const fetchAddresses = async () => {
      try {
        const addresses = await getUserAddresses();
        setSavedAddresses(addresses);

        // If there's a default address, set it as selected
        const defaultAddress = addresses.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          handleAddressSelection(defaultAddress.id, addresses);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        // Don't show error for unauthorized users (guests)
        // just keep savedAddresses as empty array
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [provinces]);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvinceId) {
        setDistricts([]);
        setWards([]);
        setSelectedDistrictId(null);
        setSelectedWardId(null);
        return;
      }

      setIsLoadingDistricts(true);
      try {
        const districtsData = await getDistrictsByProvinceId(
          selectedProvinceId
        );
        setDistricts(districtsData);
        setWards([]); // Clear wards when province changes
        if (selectedAddress) {
          const district = districtsData.find(
            (d) => d.name === selectedAddress.district
          );
          if (district) {
            setSelectedDistrictId(district.code);
          }
        } else {
          setSelectedDistrictId(null);
          setSelectedWardId(null);
          // Clear district and ward in form if they don't exist in new province
          updateCustomerInfo({
            district: "",
            ward: "",
          });
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
        setDistricts([]);
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [selectedProvinceId]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrictId) {
        setWards([]);
        setSelectedWardId(null);
        return;
      }

      setIsLoadingWards(true);
      try {
        const wardsData = await getWardsByDistrictId(selectedDistrictId);
        setWards(wardsData);

        if (selectedAddress) {
          const ward = wardsData.find((w) => w.name === selectedAddress.ward);
          if (ward) {
            setSelectedWardId(ward.code);
          }
        } else {
          setSelectedWardId(null);
          // Clear ward in form if it doesn't exist in new district
          updateCustomerInfo({
            ward: "",
          });
        }
      } catch (error) {
        console.error("Error fetching wards:", error);
        setWards([]);
        setSelectedWardId(null);
      } finally {
        setIsLoadingWards(false);
      }
    };

    fetchWards();
  }, [selectedDistrictId]);

  const handleAddressSelection = async (
    addressId: string,
    addresses: Address[] = savedAddresses
  ) => {
    if (!addressId) return;
    const selectedAddress = addresses.find((addr) => addr.id === addressId);
    if (selectedAddress) {
      updateCustomerInfo({
        phone: selectedAddress.phoneNumber,
        address: selectedAddress.address,
        province: selectedAddress.province,
        district: selectedAddress.district || "",
        ward: selectedAddress.ward || "",
      });

      // Find and set the province ID
      const province = provinces.find(
        (p) => p.name === selectedAddress.province
      );
      if (province) {
        setSelectedProvinceId(province.code);
      }
    }
  };

  const handleInputChange = (
    field: keyof typeof customerInfo,
    value: string
  ) => {
    updateCustomerInfo({ [field]: value });
    // Clear error when user starts typing
    if (validationErrors[`customerInfo.${field}`]) {
      clearValidationError(`customerInfo.${field}`);
    }

    // Clear selected address when user manually changes fields
    if (
      selectedAddress &&
      ["phone", "address", "province", "district", "ward"].includes(field)
    ) {
      setSelectedAddress(null);
    }
  };

  const handleAddressChange = (addressId: string) => {
    setSelectedAddress(savedAddresses.find((addr) => addr.id === addressId) || null);
    handleAddressSelection(addressId);
  };

  const handleProvinceChange = (provinceCode: string) => {
    const province = provinces.find((p) => p.code.toString() === provinceCode);
    if (province) {
      setSelectedProvinceId(province.code);
      handleInputChange("province", province.name);
    } else {
      setSelectedProvinceId(null);
      handleInputChange("province", "");
    }
    // Reset dependent selections
    setSelectedDistrictId(null);
    setSelectedWardId(null);
  };

  const handleDistrictChange = (districtCode: string) => {
    const district = districts.find((d) => d.code.toString() === districtCode);
    if (district) {
      setSelectedDistrictId(district.code);
      handleInputChange("district", district.name);
    } else {
      setSelectedDistrictId(null);
      handleInputChange("district", "");
    }
    // Reset ward selection
    setSelectedWardId(null);
  };

  const handleWardChange = (wardCode: string) => {
    const ward = wards.find((w) => w.code.toString() === wardCode);
    if (ward) {
      setSelectedWardId(ward.code);
      handleInputChange("ward", ward.name);
    } else {
      setSelectedWardId(null);
      handleInputChange("ward", "");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold">Thông tin đặt hàng</h2>

      <div className="space-y-4">
        {/* Saved Address Selection */}
        {!isLoadingAddresses && savedAddresses.length > 0 && (
          <div>
            <label htmlFor="saved-address" className="block mb-1">
              Chọn địa chỉ đã lưu
            </label>
            <div className="relative">
              <select
                id="saved-address"
                value={selectedAddress?.id || ""}
                onChange={(e) => handleAddressChange(e.target.value)}
                className="appearance-none w-full border border-gray-300 rounded-md px-4 py-2 pr-8"
              >
                <option value="">Chọn địa chỉ đã lưu hoặc nhập thủ công</option>
                {savedAddresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.title} - {address.address}
                    {address.ward && `, ${address.ward}`}
                    {address.district && `, ${address.district}`},{" "}
                    {address.province}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="phone" className="block mb-1">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={customerInfo.phone}
            placeholder="Nhập số điện thoại"
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={`w-full border rounded-md px-4 py-2 ${
              validationErrors["customerInfo.phone"]
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {validationErrors["customerInfo.phone"] && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors["customerInfo.phone"]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block mb-1">
            Địa chỉ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            value={customerInfo.address}
            placeholder="Nhập địa chỉ"
            onChange={(e) => handleInputChange("address", e.target.value)}
            className={`w-full border rounded-md px-4 py-2 ${
              validationErrors["customerInfo.address"]
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {validationErrors["customerInfo.address"] && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors["customerInfo.address"]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
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
              error={!!validationErrors["customerInfo.province"]}
            />
            {validationErrors["customerInfo.province"] && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors["customerInfo.province"]}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">
              Quận/Huyện <span className="text-red-500">*</span>
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
              error={!!validationErrors["customerInfo.district"]}
            />
            {validationErrors["customerInfo.district"] && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors["customerInfo.district"]}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">
              Phường/Xã <span className="text-red-500">*</span>
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
              error={!!validationErrors["customerInfo.ward"]}
            />
            {validationErrors["customerInfo.ward"] && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors["customerInfo.ward"]}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block mb-1">
            Ghi chú
          </label>
          <input
            type="text"
            id="note"
            value={customerInfo.note || ""}
            placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)"
            onChange={(e) => handleInputChange("note", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Hình thức thanh toán</h2>
        <div className="space-y-4">
          <label className="flex items-center space-x-4 border rounded-lg p-4 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="cod"
              className="w-4 h-4"
              checked={customerInfo.paymentMethod === "cod"}
              onChange={(e) =>
                updateCustomerInfo({ paymentMethod: e.target.value })
              }
            />
            <div className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="COD"
                className="w-10 h-10"
                width={40}
                height={40}
              />
              <span className="font-medium">{PAYMENT_METHOD.cod}</span>
            </div>
          </label>

          <label className="flex items-center space-x-4 border rounded-lg p-4 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="bank_transfer"
              className="w-4 h-4"
              checked={customerInfo.paymentMethod === "bank_transfer"}
              onChange={(e) =>
                updateCustomerInfo({ paymentMethod: e.target.value })
              }
            />
            <div className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Bank"
                className="w-10 h-10"
                width={40}
                height={40}
              />
              <span className="font-medium">
                {PAYMENT_METHOD.bank_transfer}
              </span>
            </div>

            <div className="text-xs text-gray-500 ml-12">
              Quét QR để thanh toán
            </div>
          </label>
          {validationErrors["paymentMethod"] && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors["paymentMethod"]}
            </p>
          )}
        </div>

        <p className="text-sm">
          Nếu bạn không hài lòng với sản phẩm của chúng tôi? Bạn hoàn toàn có
          thể trả lại sản phẩm. Tìm hiểu thêm{" "}
          <Link href="#" className="text-blue-600">
            tại đây
          </Link>
          .
        </p>
      </div>
    </>
  );
}

export default CustomerInfo;
