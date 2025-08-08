"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MdUpload, MdDelete, MdAdd, MdClose } from "react-icons/md";
import type { Product, ProductFormData } from "@/types/admin-product";
import type { Brand } from "@/actions/brand";
import { uploadImage, deleteImage } from "@/actions/upload";
import { LocalImagePaths } from "@/constant";
import Image from "next/image";

interface ProductFormProps {
  initialData?: Product | null;
  brands: Brand[];
  onSubmit: (data: ProductFormData) => Promise<void>;
}

const ProductForm = ({ initialData, brands, onSubmit }: ProductFormProps) => {
  const router = useRouter();
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedMainFile, setSelectedMainFile] = useState<File | null>(null);
  const [selectedAdditionalFiles, setSelectedAdditionalFiles] = useState<
    File[]
  >([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>(
    initialData?.mainImage || ""
  );
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<
    string[]
  >(initialData?.images || []);

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    brandId: initialData?.brandId || "",
    mainImage: initialData?.mainImage || "",
    price: initialData?.price || 0,
    discount: initialData?.discount || 0,
    description: initialData?.description || "",
    images: initialData?.images || [],
    sizes:
      initialData?.sizes?.map((size) => ({
        size: size.size,
        stock: size.stock,
      })) || [],
  });

  const [newSize, setNewSize] = useState({ size: "", stock: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const finalFormData = { ...formData };

      // Handle main image upload
      if (selectedMainFile) {
        try {
          // Delete old main image if editing
          if (initialData?.mainImage) {
            await deleteImage(initialData.mainImage, LocalImagePaths.PRODUCT);
          }

          // Upload new main image
          const newMainImageUrl = await uploadImage(
            selectedMainFile,
            LocalImagePaths.PRODUCT
          );
          finalFormData.mainImage = newMainImageUrl;
        } catch (error) {
          console.error("Error uploading main image:", error);
          throw new Error("Failed to upload main image");
        }
      }

      // Handle additional images upload
      if (selectedAdditionalFiles.length > 0) {
        try {
          // Delete old additional images if editing
          if (initialData?.images && initialData.images.length > 0) {
            for (const image of initialData.images) {
              await deleteImage(image, LocalImagePaths.PRODUCT);
            }
          }

          // Upload new additional images
          const newImageUrls = await Promise.all(
            selectedAdditionalFiles.map((file) =>
              uploadImage(file, LocalImagePaths.PRODUCT)
            )
          );
          finalFormData.images = newImageUrls;
        } catch (error) {
          console.error("Error uploading additional images:", error);
          throw new Error("Failed to upload additional images");
        }
      } else {
        // Keep existing additional images if no new files selected
        finalFormData.images = additionalImagesPreview;
      }

      await onSubmit(finalFormData);
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMainImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedMainFile(file);
      const url = URL.createObjectURL(file);
      setMainImagePreview(url);
    }
  };

  const handleAdditionalImagesSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedAdditionalFiles((prev) => [...prev, ...files]);
      const urls = files.map((file) => URL.createObjectURL(file));
      setAdditionalImagesPreview((prev) => [...prev, ...urls]);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...Array(files.length).fill("")], // Add placeholder URLs
      }));
    }
  };

  const handleRemoveMainImage = () => {
    setSelectedMainFile(null);
    setMainImagePreview("");
    setFormData((prev) => ({ ...prev, mainImage: "" }));
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setSelectedAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagesPreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddSize = () => {
    if (newSize.size && newSize.stock > 0) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, { ...newSize }],
      }));
      setNewSize({ size: "", stock: 0 });
    }
  };

  const handleAddDefaultSizes = () => {
    const defaultSizes: { size: string; stock: number }[] = [];
    for (let i = 36; i <= 45; i++) {
      defaultSizes.push({ size: i.toString(), stock: 1 });
    }
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, ...defaultSizes],
    }));
  };

  const handleRemoveSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, isMain: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        if (isMain) {
          setSelectedMainFile(file);
          const url = URL.createObjectURL(file);
          setMainImagePreview(url);
        } else {
          setSelectedAdditionalFiles((prev) => [...prev, file]);
          const url = URL.createObjectURL(file);
          setAdditionalImagesPreview((prev) => [...prev, url]);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Information */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thương hiệu *
            </label>
            <select
              required
              value={formData.brandId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, brandId: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giá (VNĐ) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value) || 0,
                }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập giá sản phẩm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giảm giá (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  discount: parseFloat(e.target.value) || 0,
                }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập phần trăm giảm giá"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập mô tả về sản phẩm"
            />
          </div>
        </div>

        {/* Right Column - Product Images */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Hình ảnh sản phẩm</h2>
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh chính
            </label>
            {mainImagePreview ? (
              <div className="relative inline-block">
                <Image
                  src={mainImagePreview}
                  alt="Main product image"
                  className="w-64 h-64 object-cover rounded-lg border border-gray-200"
                  width={256}
                  height={256}
                />
                <button
                  type="button"
                  onClick={handleRemoveMainImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  title="Remove image"
                >
                  <MdDelete className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer max-w-80 m-auto"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, true)}
                onClick={() => mainImageInputRef.current?.click()}
              >
                <div className="flex flex-col items-center space-y-4">
                  <MdUpload className="w-12 h-12 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    Kéo thả hoặc click để tải lên hình ảnh chính
                  </div>
                  <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Thay đổi
                  </span>
                  <input
                    ref={mainImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageSelect}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh phụ
            </label>
            <div className="grid grid-cols-3 gap-4">
              {additionalImagesPreview.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image}
                    alt={`Additional product image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    width={256}
                    height={256}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditionalImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Remove image"
                  >
                    <MdClose className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer flex flex-col items-center justify-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => additionalImagesInputRef.current?.click()}
              >
                <MdAdd className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">Thêm</span>
                <input
                  ref={additionalImagesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sizes and Inventory Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Kích thước và tồn kho</h3>

        <div className="space-y-4">
          {formData.sizes.map((size, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="text"
                value={size.size}
                onChange={(e) => {
                  const newSizes = [...formData.sizes];
                  newSizes[index].size = e.target.value;
                  setFormData((prev) => ({ ...prev, sizes: newSizes }));
                }}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Size"
              />
              <input
                type="number"
                min="0"
                value={size.stock}
                onChange={(e) => {
                  const newSizes = [...formData.sizes];
                  newSizes[index].stock = parseInt(e.target.value) || 0;
                  setFormData((prev) => ({ ...prev, sizes: newSizes }));
                }}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Số lượng"
              />
              <button
                type="button"
                onClick={() => handleRemoveSize(index)}
                className="bg-red-600 hover:bg-red-800  text-white rounded-md p-2"
              >
                <MdDelete className="w-5 h-5" />
              </button>
            </div>
          ))}

          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newSize.size}
              onChange={(e) =>
                setNewSize((prev) => ({ ...prev, size: e.target.value }))
              }
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Size mới"
            />
            <input
              type="number"
              min="0"
              value={newSize.stock}
              onChange={(e) =>
                setNewSize((prev) => ({
                  ...prev,
                  stock: parseInt(e.target.value) || 0,
                }))
              }
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Số lượng"
            />
            <button
              type="button"
              onClick={handleAddSize}
              className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700"
            >
              <MdAdd className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleAddDefaultSizes}
              className="bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 text-sm"
            >
              Tạo size mặc định (36-45)
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Đang lưu..." : initialData ? "Lưu thay đổi" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
