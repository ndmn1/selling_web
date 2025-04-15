import React from 'react'


const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;
function ProductSkeleton() {
  return (
    <div className="col-span-4 space-y-4 lg:col-span-1">
      <div className={`relative h-56 rounded-xl bg-gray-300 ${shimmer}`} />

      <div className={`h-4 w-full rounded-lg bg-gray-300 ${shimmer}`} />
      <div className={`h-4 w-1/2 rounded-lg bg-gray-300 ${shimmer}`} />
      <div className={`h-6 w-1/3 rounded-lg bg-gray-300 ${shimmer}`} />
    </div>
  )
}

export default ProductSkeleton
