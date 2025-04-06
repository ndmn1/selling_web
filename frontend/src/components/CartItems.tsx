/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useCart } from "@/context/CartCountProvider";
import { useCartSummary } from "@/context/CartSummaryProvider";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import Image from "next/image";
import { cartProducts, products, detailProducts } from "@/data/product";
import { DetailedProduct } from "@/types/product";
import { CartProduct } from "@/types/product";
import { getCookie } from "@/lib/cookies";
import {  FaChevronDown, FaTrash } from "react-icons/fa";
import { FiMinus,FiPlus } from "react-icons/fi";
function CartItems() {
  
  const { changeTotal, changeVocherCode, total } = useCartSummary();
  const [editId, setEditId] = useState<string | null>(null);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };
  const [curVocher, setCurVocher] = useState("");
  const applyVoucher = (code: string) => {
    if (code === "VOCHER") {
      setCurVocher("");
      changeVocherCode(code);
    } else {
      alert("Invalid voucher code");
    }
  };
  const { removeFromCart, changeItemQuantity, changeItemSize } = useCart();
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  useEffect(() => {
    const loadCartItems = () => {
      const cartCookie = getCookie("cart-items");
      if (cartCookie) {
        try {
          const items = JSON.parse(cartCookie);
          const flattenedItems: CartProduct[] = [];

          // Convert the nested structure to a flat array for display
          //Record<string, Record<string, number>>
          Object.entries(items).forEach(([productId, sizes]) => {
            Object.entries(sizes as Record<string, number>).forEach(
              ([size, quantity]) => {
                const product = detailProducts.find(
                  (item) => item.id === productId
                );
                if (product) {
                  flattenedItems.push({
                    ...product,
                    selectedSize: size,
                    quantity,
                    cartId: `${productId}-${size}`,
                  });
                }
              }
            );
          });

          setCartItems(flattenedItems);
        } catch (e) {
          console.error("Failed to parse cart items", e);
        }
      }
    };

    loadCartItems();
  }, []);
  const handleRemoveItem = async (productId: string, size: string) => {
    const key = `${productId}-${size}`;
    await removeFromCart(productId, size);
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === productId && item.selectedSize === size)
      )
    );
  };
  const [chooseItems, setChooseItems] = useState<string[]>([]);
  const handleChooseItem = (cartId: string, checked: boolean) => {
    if (checked) {
      setChooseItems((prev) => [...prev, cartId]);
    } else {
      setChooseItems((prev) =>
        prev.filter((item) => item !== cartId)
      );
    }
  };
  const handleChooseAll = (checked: boolean) => {
    if (checked) {
      setChooseItems(cartItems.map((item) => item.cartId));
    } else {
      setChooseItems([]);
    }
  };
  useEffect(() => {
    const total = cartItems.reduce((total, item) => {
      const price = item.salePrice || item.price;
      if (chooseItems.includes(item.cartId)) {
        return total + price * item.quantity;
      }
      return total;
    }, 0);
    changeTotal(total); // Move this to useEffect
  }, [cartItems, chooseItems, changeTotal]);
  const handleUpdateQuantity = async (
    productId: string,
    size: string,
    newQuantity: number
  ) => {
    const stockQuantity =
      cartItems
        .find((item) => item.id === productId && item.selectedSize === size)
        ?.sizes.find((s) => s.size === size)?.stock || 1;
    const key = `${productId}-${size}`;
    newQuantity = Math.min(stockQuantity, newQuantity);
    await changeItemQuantity(productId, size, newQuantity);

    // Update local state
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId && item.selectedSize === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    setEditId(null); // Reset editId after updating
  };

  const handleChangeSize = async (
    productId: string,
    currentSize: string,
    newSize: string
  ) => {
    console.log(cartItems);
    const oldItem = cartItems.find(
      (item) => item.id === productId && item.selectedSize === currentSize
    );
    const newItem = cartItems.find(
      (item) => item.id === productId && item.selectedSize === newSize
    );
    console.log(oldItem, newItem);
    const newSizeStock =
      oldItem?.sizes.find((s) => s.size === newSize)?.stock || 0;
    const oldSizeStock =
      oldItem?.sizes.find((s) => s.size === currentSize)?.stock || 0;
    console.log("newSizeStock", newSizeStock, oldSizeStock);
    const key = `${productId}-${currentSize}`;
    changeItemSize(productId, currentSize, newSize, newSizeStock);

    const newCart = cartItems.filter(
      (item) => !(item.id === productId && item.selectedSize === newSize)
    );
    setCartItems(
      newCart.map((item) =>
        item.id === productId && item.selectedSize === currentSize
          ? {
              ...item,
              selectedSize: newSize,
              quantity: Math.min(
                newSizeStock,
                item.quantity + (newItem?.quantity || 0)
              ),
            }
          : item
      )
    );
  };

  return (
    <div className="bg-white border rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold">Giỏ hàng</h2>

      <div className="flex items-center justify-between text-sm border-b pb-4">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="select-all" className="w-4 h-4" onChange={(e) => handleChooseAll(e.target.checked)}/>
          <label htmlFor="select-all">TẤT CẢ SẢN PHẨM</label>
        </div>
        <button className="text-gray-500">XÓA TẤT CẢ</button>
      </div>

      <div className="border-b pb-6">
        <div className="flex flex-col items-start gap-4">
          {cartItems.map((cartItem) => (
            <div
              key={cartItem.cartId}
              className="border-b border-gray-200 py-4 w-full"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id={`select-${cartItem.cartId}`}
                  checked={chooseItems.includes(cartItem.cartId)}
                  className="h-5 w-5 rounded border-gray-300"
                  onChange={(e) => {
                    handleChooseItem(cartItem.cartId, e.target.checked);
                  }}
                />
                <div className="relative h-24 w-24 bg-gray-100">
                  <Image
                    src={
                      cartItem.mainImage ||
                      "/logo.png"
                    }
                    alt={cartItem.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    {cartItem.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {cartItem.brand} / {cartItem.selectedSize || "Select Size"}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="relative">
                      <select
                        value={cartItem.selectedSize}
                        onChange={(e) =>
                          handleChangeSize(
                            cartItem.id,
                            cartItem.selectedSize,
                            e.target.value
                          )
                        }
                        className="appearance-none w-[120px] px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="" disabled>
                          Select Size
                        </option>
                        {cartItem.sizes.map((size) => (
                          <option key={size.size} value={size.size}>
                            {size.size}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <FaChevronDown className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            cartItem.id,
                            cartItem.selectedSize,
                            cartItem.quantity - 1
                          )
                        }
                        disabled={cartItem.quantity <= 1}
                        className="px-3 py-2 border-r border-gray-300 hover:bg-gray-100"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      {editId === cartItem.cartId && (
                        <input
                          autoFocus
                          type="number"
                          defaultValue={cartItem.quantity}
                          onBlur={(e) =>
                            handleUpdateQuantity(
                              cartItem.id,
                              cartItem.selectedSize,
                              Number.parseInt(e.target.value) || 1
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateQuantity(
                                cartItem.id,
                                cartItem.selectedSize,
                                Number.parseInt(e.currentTarget.value) || 1
                              );
                              e.currentTarget.blur();
                            }
                          }}
                          className="w-12 text-center border-none focus:outline-none"
                          min="0"
                          max={
                            cartItem.sizes.find(
                              (size) => size.size === cartItem.selectedSize
                            )?.stock || 0
                          }
                          disabled={!cartItem.selectedSize}
                        />
                      )}
                      {!(editId === cartItem.cartId) && (
                        <span
                          onClick={() => setEditId(cartItem.cartId)}
                          className="w-12 text-center border-none focus:outline-none"
                        >
                          {cartItem.quantity}
                        </span>
                      )}
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            cartItem.id,
                            cartItem.selectedSize,
                            cartItem.quantity + 1
                          )
                        }
                        disabled={
                          cartItem.quantity >=
                          (cartItem.sizes.find(
                            (size) => size.size === cartItem.selectedSize
                          )?.stock ?? 0)
                        }
                        className="px-3 py-2 border-l border-gray-300 hover:bg-gray-100"
                        aria-label="Increase quantity"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-lg font-bold">
                    {formatPrice(cartItem.salePrice || cartItem.price)}
                  </span>
                  <button className="flex items-center text-gray-500 hover:text-red-500">
                    <FaTrash className="w-4 h-4 mr-1" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              className="w-full border rounded-md px-4 py-3"
              value={curVocher}
              onChange={(e) => setCurVocher(e.target.value)}
            />
          </div>
          <button
            className="border rounded-md px-4 py-3 bg-white hover:bg-gray-50"
            onClick={() => applyVoucher(curVocher)}
          >
            Áp dụng Voucher
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>0đ</span>
          </div>
          <div className="flex justify-between">
            <span>Giảm giá</span>
            <span>0đ</span>
          </div>
          <div className="flex justify-between">
            <span>Phí giao hàng</span>
            <span className="text-green-600">Miễn phí</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Tổng</span>
            <span>{total}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
