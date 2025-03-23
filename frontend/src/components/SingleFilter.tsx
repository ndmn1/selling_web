"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export type SingleFilterOption = {
  id: string;
  label: string;
  value: string;
};

type SingleFilterProps = {
  title: string;
  options: SingleFilterOption[];
  searchParamName: string;
  className?: string;
};

export function SingleFilter({
  title,
  options, //   [ { id: "35.0", label: "35.0VN", value: "35.0" }, ]
  searchParamName,  
}: SingleFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true);

  // Initialize selected options from URL on component mount
  useEffect(() => {
    console.log("SingleFilter useEffect");
    console.log("isFirstRender.current", isFirstRender.current);
    if (isFirstRender.current) {
      isFirstRender.current = false;

      const params = searchParams.getAll(searchParamName);

      if (params.length > 0) {
        // Find matching option IDs based on values in the URL
        const selectedIds = options
          .filter((option) => params.includes(option.value))
          .map((option) => option.id);

        setSelectedOptions(selectedIds);
      } else {
        setSelectedOptions([]);
      }
    }
  }, [options, searchParams, searchParamName]);

  //  Initialize selected options from URL on component mount (method 2)
  // const selectedOptions = useMemo<string[]>(() => {
  //   console.log("SingleFilter useMemo");
  //   const params = searchParams.getAll(searchParamName);
  //   return options
  //     .filter((option) => params.includes(option.value))
  //     .map((option) => option.id);
  // }
  // , [options, searchParams, searchParamName]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle checkbox change
  const handleCheckboxChange = (id: string, checked: boolean) => {
    // Update state
    const newSelected = checked
      ? [...selectedOptions, id]
      : selectedOptions.filter((item) => item !== id);

    setSelectedOptions(newSelected);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete(searchParamName);

    // Get values for selected IDs and add them to URL
    newSelected.forEach((selectedId) => {
      const option = options.find((opt) => opt.id === selectedId);
      if (option) {
        params.append(searchParamName, option.value);
      }
    });

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <h2 className="text-gray-700 font-medium mb-3">{title}</h2>
      <div className="mb-3">
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Tìm nhanh"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
        {filteredOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id={option.id}
              checked={selectedOptions.includes(option.id)}
              onChange={(e) =>
                handleCheckboxChange(option.id, e.target.checked)
              }
            />
            <label
              htmlFor={option.id}
              className="text-sm leading-none"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
