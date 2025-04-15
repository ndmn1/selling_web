"use client";
import {  useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  FaStar,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCheck,
  FaTint,
} from "react-icons/fa";
import { DetailedProduct } from "@/types/product";
import { useRouter } from 'next/navigation';
import { useCart } from "@/context/CartCountProvider";
function ProductInfo({ data }: { data: Promise<DetailedProduct> }) {
  const [product, setProduct] = useState<DetailedProduct>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [addedToBag, setAddedToBag] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();
  useEffect(() => {
    data?.then((data) => {
      setProduct(data);
    });
  });



  const handleAddToBag = () => {
    setAddedToBag(true);
    addToCart(product?.id as string, selectedSize);
    router.refresh();
  };

  const handleCloseNotification = () => {
    setAddedToBag(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (product&& prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setSelectedImage((prev) => (product&& prev === 0 ? product.images.length - 1 : prev - 1));
  };
  return (
    <>
      {/* Product Page */}
      <div className="flex flex-col lg:flex-row gap-4 relative justify-center ">
        <div className="flex-1 lg:max-w-[100vh] ">
          <div className="lg:w-[95%] pb-[100%] relative lg:sticky lg:top-10">
            <div className="md:flex gap-2 p-2  absolute inset-0">
              {/* Thumbnails - Desktop Only */}
              <div className="hidden lg:flex flex-col gap-2 p-2 overflow-hidden">
                {product&&product.images.map((img, index) => (
                  <div
                    key={index}
                    className={clsx(
                      "border rounded-md  cursor-pointer transition-all w-16 h-16",
                      selectedImage === index
                        ? "border-gray-800"
                        : "border-gray-200"
                    )}
                    onClick={() => setSelectedImage(index)}
                    onMouseEnter={() => setSelectedImage(index)}
                  >
                    <Image
                      src={"/placeholder.svg?height=80&width=80"}
                      alt={`Product view ${index + 1}`}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative flex-1 bg-gray-100 h-full">
                <div className="absolute top-4 left-4 z-10 bg-white rounded-full px-3 py-1 flex items-center">
                  <FaStar className="w-4 h-4 mr-1 text-black" />
                  <span className="text-sm font-medium">High Quality</span>
                </div>

                <Image
                  src={"https://picsum.photos/200"}
                  alt="Nike Vomero 18"
                  fill
                  className="object-cover "
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                  aria-label="Previous image"
                >
                  <FaChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                  aria-label="Next image"
                >
                  <FaChevronRight className="w-5 h-5" />
                </button>

                {/* Mobile Indicator Dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 md:hidden">
                  {product&&product.images.map((_, index) => (
                    <button
                      key={index}
                      className={clsx(
                        "w-2 h-2 rounded-full",
                        selectedImage === index ? "bg-black" : "bg-gray-300"
                      )}
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 md:p-6 w-full lg:w-[450px]">
          <div className="text-red-600 font-medium mb-1">
            Sustainable Materials
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Nike Vomero 18</h1>
          <p className="text-gray-600 mb-2">Women&#39;s Road Running Shoes</p>
          <p className="text-xl font-bold mb-6">4,259,000₫</p>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium">Select Size</h2>
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                <span className="text-sm">Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {product?.sizes.map((size) => (
                <button
                  key={size.size}
                  className={clsx(
                    "border rounded-md py-3 px-2 text-center transition-all",
                    selectedSize === size.size
                      ? "border-gray-800"
                      : "border-gray-200",
                    !size.stock && "opacity-40 cursor-not-allowed bg-gray-100"
                  )}
                  disabled={!size.stock}
                  onClick={() => size.stock && setSelectedSize(size.size)}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Bag & Favorite */}
          <div className="space-y-3">
            <button
              className="w-full bg-black hover:bg-gray-800 text-white py-6 rounded-full"
              onClick={handleAddToBag}
            >
              Add to Bag
            </button>
            <button className="w-full py-6 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center">
              <FaHeart className="w-5 h-5 mr-2" />
              Favourite
            </button>
          </div>

          {/* Product Details */}
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-gray-50 rounded-md text-center">
              <p className="text-gray-700">
                This product is excluded from site promotions and discounts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <FaTint className="w-5 h-5 text-gray-700" />
              <p className="text-gray-700">
                This product is made with at least 20% recycled content by
                weight
              </p>
            </div>

            <p className="text-gray-700">
              Maximum cushioning in the Vomero provides a comfortable ride for
              everyday runs. Our softest, most cushioned ride has lightweight
              ZoomX foam stacked on top of responsive ReactX foam in the
              midsole. Plus, a redesigned traction pattern offers a smooth
              heel-to-toe transition.
            </p>
          </div>
        </div>
      </div>
      {/* Added to Bag Notification */}
      {addedToBag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <FaCheck className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-medium">Added to Bag</span>
              </div>
              <button onClick={handleCloseNotification}>
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <Image
                src="/images/vomero-main.png"
                alt="Nike Vomero 18"
                width={80}
                height={80}
                className="object-cover rounded-md"
              />
              <div>
                <h3 className="font-medium">Nike Vomero 18</h3>
                <p className="text-sm text-gray-600">
                  Women&#39;s Road Running Shoes
                </p>
                <p className="text-sm text-gray-600">Size: {selectedSize}</p>
                <p className="font-medium">4,259,000₫</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-white hover:bg-gray-50 text-black border border-gray-300 py-6 rounded-full">
                View Bag (1)
              </button>
              <button className="w-full bg-black hover:bg-gray-800 text-white py-6 rounded-full">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductInfo;
