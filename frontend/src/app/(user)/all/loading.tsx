import ProductSkeleton from '@/components/ProductSkeleton'
import React from 'react'



function loading() {
  return (
    <div className="space-y-6 pb-[5px]">

      <div className="grid grid-cols-4 gap-6">
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
      </div>
    </div>
  )
}

export default loading
