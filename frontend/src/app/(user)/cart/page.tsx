import CartBottomBar from "@/components/CartBottomBar";
import CartItem from "@/components/CartItems";
import CustomerInfo from "@/components/CustomerInfo";

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="order-1 lg:order-2 space-y-8">
            <CartItem />
        </div>

        <div className="order-2 lg:order-1 space-y-8">
          <CustomerInfo />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t py-4 px-4 z-10">
        <CartBottomBar />
      </div>
    </div>
  )
}

