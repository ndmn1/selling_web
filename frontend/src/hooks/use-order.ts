import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder as createOrderAction } from '@/actions/order';
import { useCart } from '@/context/CartCountProvider';
import { OrderData } from '@/types/order';

export const useOrder = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { removeFromCookieCart } = useCart();

  const createOrder = async (orderData: OrderData = {}) => {
    // if (!session?.user) {
    //   const callbackUrl = encodeURIComponent(window.location.href);
    //   router.push(`/login?callbackUrl=${callbackUrl}`);
    //   return;
    // }

    setError(null);

    startTransition(async () => {
      try {
        const result = await createOrderAction(orderData);
        if (result.success) {
          // Remove ordered items from cookie cart for guest users
          if (orderData.cartItems) {
            orderData.cartItems.forEach((cartItem) => {
              const sizeId = cartItem.sizes.find(s => s.size === cartItem.selectedSize)?.id;
              if (sizeId) {
                removeFromCookieCart(sizeId);
              }
            });
          }
          router.push(`/order/${result.order.id}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('Error creating order:', err);
      }
    });
  };

  return {
    createOrder,
    loading: isPending,
    error,
  };
}; 