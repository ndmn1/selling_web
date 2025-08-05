"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DashboardHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get dates from URL params or use defaults
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const urlStartDate = searchParams.get("startDate");
  const urlEndDate = searchParams.get("endDate");

  const [startDate, setStartDate] = useState<Date>(
    urlStartDate ? new Date(urlStartDate) : thirtyDaysAgo
  );
  const [endDate, setEndDate] = useState<Date>(
    urlEndDate ? new Date(urlEndDate) : today
  );

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const updateURL = (newStartDate: Date, newEndDate: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("startDate", formatDateForInput(newStartDate));
    params.set("endDate", formatDateForInput(newEndDate));
    router.push(`/admin/dashboard?${params.toString()}`);
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
      updateURL(date, endDate);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setEndDate(date);
      updateURL(startDate, date);
    }
  };

  return (
    <div className="mb-4 sm:mb-8">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-white p-2 px-3 rounded-md">
          {/* Start Date */}
          <div className="relative ">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              maxDate={endDate}
              dateFormat="dd/MM/yyyy"
              className="border border-gray-200 p-1 rounded-md"
              popperClassName="z-50"
              calendarClassName="shadow-lg border border-gray-200 rounded-lg"
            />
          </div>

          <span className="text-sm">To</span>

          {/* End Date */}
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              minDate={startDate}
              maxDate={today}
              className="border border-gray-200 p-1 rounded-md"
              dateFormat="dd/MM/yyyy"
              popperClassName="z-50"
              calendarClassName="shadow-lg border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
