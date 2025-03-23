"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export type RangeFilterOption = {
  id: string;
  label: string;
  min: number;
  max: number;
};

type RangleFilterProps = {
  title: string;
  options: RangeFilterOption[];
  className?: string;
};

export function RangleFilter({ title, options }: RangleFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [arbitraryValue, setArbitraryValue] = useState({
    from: "",
    to: "",
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true);

  // Initialize selected option from URL on component mount
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      const fromParam = searchParams.get("from");
      const toParam = searchParams.get("to");

      if (fromParam && toParam) {
        const from = Number.parseInt(fromParam);
        const to = Number.parseInt(toParam);

        const matchingOption = options.find(
          (option) => option.min === from && option.max === to
        );

        if (matchingOption) {
          setSelectedOption(matchingOption.id);
        }
      } else {
        setSelectedOption(null);
      }
    }
  }, [options, searchParams]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle checkbox change
  const handleCheckboxChange = (id: string, checked: boolean) => {
    // Update state
    const newSelected = checked ? id : null;
    setSelectedOption(newSelected);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");

    if (checked) {
      if (id === "arbitrary") {
        if(arbitraryValue.from ) {
          params.set("from", arbitraryValue.from);
        }
        if(arbitraryValue.to ) {
          params.set("to", arbitraryValue.to);
        }
      } else {
        const selectedOption = options.find((opt) => opt.id === id);
        if (selectedOption) {
          params.set("from", selectedOption.min.toString());
          params.set("to", selectedOption.max.toString());
        }
      }
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <h2 className="text-gray-700 font-medium mb-3">{title}</h2>
      <div className="mb-3">
        <input
          placeholder="Tìm nhanh"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
      <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
        <div className="flex items-center space-x-2 mb-2 ">
          <input
            type="checkbox"
            id="abritrary"
            checked={selectedOption === "arbitrary"}
            onChange={(e) =>
              handleCheckboxChange("arbitrary", e.target.checked)
            }
          />
          <input
            className="p-1 m-1 text-sm  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 max-w-[5rem]"
            type="number"
            placeholder="Từ"
            value={arbitraryValue.from}
            onChange={(e) =>
              setArbitraryValue({ ...arbitraryValue, from: e.target.value })
            }
          />
          <span>-</span>
          <input
            className="p-1 m-1 text-sm  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 max-w-[5rem]"
            type="number"
            placeholder="Đến"
            value={arbitraryValue.to}
            onChange={(e) =>
              setArbitraryValue({ ...arbitraryValue, to: e.target.value })
            }
          />
        </div>
        {filteredOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id={option.id}
              checked={selectedOption === option.id}
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
