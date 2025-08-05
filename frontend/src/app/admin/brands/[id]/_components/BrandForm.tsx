"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MdUpload, MdDelete } from "react-icons/md";
import type { Brand, BrandFormData } from "@/actions/brand";
import { uploadImage, deleteImage } from "@/actions/upload";
import { LocalImagePaths } from "@/constant";
import Image from "next/image";

interface BrandFormProps {
  initialData?: Brand | null;
  onSubmit: (data: BrandFormData) => Promise<void>;
}

const BrandForm = ({ initialData, onSubmit }: BrandFormProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.logo || "");
  const [formData, setFormData] = useState<BrandFormData>({
    name: initialData?.name || "",
    logo: initialData?.logo || "",
    description: initialData?.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const finalFormData = { ...formData };

      // Handle file upload if there's a new file
      if (selectedFile) {
        try {
          // Delete old image if editing
          if (initialData?.logo) {
            await deleteImage(initialData.logo, LocalImagePaths.BRAND);
          }

          // Upload new image
          const newLogoUrl = await uploadImage(selectedFile, LocalImagePaths.BRAND);
          finalFormData.logo = newLogoUrl;
        } catch (error) {
          console.error("Error uploading image:", error);
          throw new Error("Failed to upload image");
        }
      }

      await onSubmit(finalFormData);
      router.push("/admin/brands");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData((prev) => ({ ...prev, logo: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tên thương hiệu *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Nhập tên thương hiệu"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo thương hiệu
        </label>

        {previewUrl ? (
          <div className="relative inline-block">
            <Image
              src={previewUrl}
              alt="Brand logo"
              width={256}
              height={256}
              className="w-64 object-contain rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              title="Remove image"
            >
              <MdDelete className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer max-w-96 m-auto"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleDivClick}
          >
            <div className="flex flex-col items-center space-y-4">
              <MdUpload className="w-12 h-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                Kéo thả hoặc click để tải lên logo
              </div>
              <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Chọn file
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
        <textarea
          value={formData.description || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Nhập mô tả về thương hiệu"
        />
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
          {isLoading ? "Đang lưu..." : initialData ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default BrandForm;
