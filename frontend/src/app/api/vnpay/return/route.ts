/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { vnpayService } from '@/services/vnpay';
import { createOrder } from '@/actions/order';
import { OrderStatus } from '@prisma/client';

// route này dùng để xử lý kết quả thanh toán của VNPay với frontend
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params: Record<string, string | number> = {};
    
    // Convert URLSearchParams to object
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    console.log("request", request.url);
    // Verify the return URL signature
    const isValid = vnpayService.verifyReturnUrl({ ...params });
    
    if (!isValid) {
      // Redirect to failure page
      return NextResponse.redirect(
        new URL('/cart/payment-result?status=error&message=Invalid signature', (process.env.NEXT_PUBLIC_BASE_URL || 'https://b043a1a6f741.ngrok-free.app'))
      );
    }

    const vnp_ResponseCode = params.vnp_ResponseCode;
    const vnp_TxnRef = params.vnp_TxnRef;
    const vnp_Amount = params.vnp_Amount;
    const vnp_TransactionNo = params.vnp_TransactionNo;

    if (vnp_ResponseCode === '00') {
      // Payment successful - Create order in database
      try {
        // Get pending order data from cookies
        const pendingOrderData = request.cookies.get('pendingOrder')?.value;
        
        if (pendingOrderData) {
          const decodedString = Buffer.from(pendingOrderData, 'base64').toString('utf8');
          const orderData = JSON.parse(decodedString);
          
          // Verify this is the correct order
          if (orderData.orderId === String(vnp_TxnRef)) {
            // Create the order in the database
            const order = await createOrder({
                status: OrderStatus.CONFIRMED, // Payment confirmed
                paymentMethod: orderData.paymentMethod,
                voucherCode: orderData.voucherCode,
                shippingAddress: orderData.shippingAddress,
                phoneNumber: orderData.phoneNumber,
                notes: orderData.notes,
                cartItems: orderData.cartItems,
            });

            console.log('Order created successfully:', order);
            
            // Clear pending order cookie and redirect to order page
            const response = NextResponse.redirect(
              new URL(`/order/${order.order.id}`, (process.env.NEXT_PUBLIC_BASE_URL || 'https://b043a1a6f741.ngrok-free.app'))
            );
            response.cookies.delete('pendingOrder');
            
            return response;
          }
        }
        
        // If no pending order data or mismatch, redirect to payment result
        return NextResponse.redirect(
          new URL(
            `/cart/payment-result?status=success&orderId=${vnp_TxnRef}&amount=${vnp_Amount}&transactionNo=${vnp_TransactionNo}`,
            (process.env.NEXT_PUBLIC_BASE_URL || 'https://b043a1a6f741.ngrok-free.app')
          )
        );
      } catch (dbError) {
        console.error('Error creating order:', dbError);
        return NextResponse.redirect(
          new URL(
            `/cart/payment-result?status=error&message=Error creating order&orderId=${vnp_TxnRef}`,
            (process.env.NEXT_PUBLIC_BASE_URL || 'https://b043a1a6f741.ngrok-free.app')
          )
        );
      }
    } else {
      // Payment failed
      return NextResponse.redirect(
        new URL(
          `/cart/payment-result?status=failed&orderId=${vnp_TxnRef}&code=${vnp_ResponseCode}`,
          (process.env.NEXT_PUBLIC_BASE_URL || 'https://b043a1a6f741.ngrok-free.app')
        )
      );
    }
  } catch (error) {
    console.error('Error processing VNPay return:', error);
    return NextResponse.redirect(
      new URL('/cart/payment-result?status=error&message=Processing error', (process.env.NEXT_PUBLIC_BASE_URL || 'https://b043a1a6f741.ngrok-free.app'))
    );
  }
} 