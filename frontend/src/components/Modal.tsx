"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { useEffect } from "react";

interface ModalProps {
  children: React.ReactNode;
}

export function Modal({ children }: ModalProps) {
  const router = useRouter();

  const onDismiss = () => {
    router.back();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onDismiss();
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <div className="absolute z-20 left-0 right-0 top-0 bottom-0 mx-auto">
        <div
          className="h-svh fixed inset-0 bg-black bg-opacity-30 z-10 top-16"
          onClick={() => onDismiss()}
        ></div>
        <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 p-6">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto overflow-hidden p-5">
            <div className="flex justify-end p-2">
              <button
                onClick={onDismiss}
                className="rounded-full hover:bg-gray-100"
              >
                <IoMdClose className="h-5 w-5" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
