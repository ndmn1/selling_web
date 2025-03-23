import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types/product"
import { FaEye } from "react-icons/fa";
interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <div key={product.id} className="group relative bg-white rounded-md overflow-hidden border border-gray-200">
          <div className="relative">
            {product.discountPercentage > 0 && (
              <div className="absolute top-2 left-2 z-10 bg-cyan-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-medium">
                -{product.discountPercentage}%
              </div>
            )}
            <Link href={`/product/${product.id}`}>
              <Image
                src={"https://picsum.photos/200"}
                alt={product.name}
                width={300}
                height={300}
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 hover:bg-gray-300 rounded-full p-2">
              <FaEye />
            </button>
          </div>
          <div className="p-3">
            <Link href={`/product/${product.id}`} className="block">
              <h3 className="text-sm font-medium text-gray-700 hover:text-blue-600 mb-1">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-600">{product.salePrice.toLocaleString()}₫</span>
              {product.originalPrice > product.salePrice && (
                <span className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString()}₫</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

