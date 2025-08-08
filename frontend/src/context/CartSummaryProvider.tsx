"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import { CustomerInfo } from "@/schemas/order";
import { CartProduct } from "@/types/product";

// Define the type for our cart context
type CartSummaryContextType = {
  total: number;
  vocherCode: string;
  customerInfo: CustomerInfo;
  selectedCartItems: CartProduct[];
  validationErrors: Record<string, string>;
  changeVocherCode: (code: string) => void;
  changeTotal: (total: number) => void;
  updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
  setSelectedCartItems: (items: CartProduct[]) => void;
  setValidationErrors: (errors: Record<string, string>) => void;
  clearValidationError: (field: string) => void;
};

// Create the context with default values
const CartSummaryContext = createContext<CartSummaryContextType>({
  total: 0,
  vocherCode: "",
  customerInfo: {
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
    paymentMethod: "cod",
  },
  selectedCartItems: [],
  validationErrors: {},
  changeVocherCode: () => {},
  changeTotal: () => {},
  updateCustomerInfo: () => {},
  setSelectedCartItems: () => {},
  setValidationErrors: () => {},
  clearValidationError: () => {},
});

// Custom hook to use the cart context
export const useCartSummary = () => useContext(CartSummaryContext);

export function CartSummaryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [total, setTotal] = useState(0);
  const [vocherCode, setVocherCode] = useState("");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
    paymentMethod: "cod",
  });
  const [selectedCartItems, setSelectedCartItemsState] = useState<
    CartProduct[]
  >([]);
  const [validationErrors, setValidationErrorsState] = useState<
    Record<string, string>
  >({});

  const changeVocherCode = (code: string) => {
    setVocherCode(code);
  };

  const changeTotal = (total: number) => {
    setTotal(total);
  };

  const updateCustomerInfo = (info: Partial<CustomerInfo>) => {
    setCustomerInfo((prev) => ({ ...prev, ...info }));
  };

  const setSelectedCartItems = (items: CartProduct[]) => {
    setSelectedCartItemsState(items);
  };

  const setValidationErrors = (errors: Record<string, string>) => {
    setValidationErrorsState(errors);
  };

  const clearValidationError = (field: string) => {
    setValidationErrorsState((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <CartSummaryContext.Provider
      value={{
        total,
        vocherCode,
        customerInfo,
        selectedCartItems,
        validationErrors,
        changeVocherCode,
        changeTotal,
        updateCustomerInfo,
        setSelectedCartItems,
        setValidationErrors,
        clearValidationError,
      }}
    >
      {children}
    </CartSummaryContext.Provider>
  );
}
