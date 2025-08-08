import { NextRequest, NextResponse } from 'next/server';
import { vnpayService } from '@/services/vnpay';
// route này dùng để xử lý kết quả thanh toán của VNPay với backend, các bước xử lý:
// 1. Verify the IPN signature
// 2. Update order status in your database
// 3. Send notifications if needed

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify the IPN signature
    const isValid = vnpayService.verifyIpnUrl({ ...body });
    
    if (!isValid) {
      return NextResponse.json({ RspCode: '97', Message: 'Invalid signature' });
    }

    const vnp_ResponseCode = body.vnp_ResponseCode;
    const vnp_TxnRef = body.vnp_TxnRef;
    const vnp_Amount = body.vnp_Amount;
    const vnp_TransactionNo = body.vnp_TransactionNo;
    const vnp_TransactionStatus = body.vnp_TransactionStatus;

    console.log('VNPay IPN received:', {
      orderId: vnp_TxnRef,
      responseCode: vnp_ResponseCode,
      transactionStatus: vnp_TransactionStatus,
      amount: vnp_Amount,
      transactionNo: vnp_TransactionNo
    });

    // TODO: Update order status in your database
    // You should implement logic here to:
    // 1. Find the order by vnp_TxnRef (orderId)
    // 2. Update the order payment status based on vnp_ResponseCode and vnp_TransactionStatus
    // 3. Send notifications if needed

    if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
      // Payment successful
      console.log(`Payment successful for order ${vnp_TxnRef}`);
      // TODO: Update order status to "paid" in database
      
      return NextResponse.json({ RspCode: '00', Message: 'Confirm success' });
    } else {
      // Payment failed or other status
      console.log(`Payment failed/other status for order ${vnp_TxnRef}, code: ${vnp_ResponseCode}`);
      // TODO: Update order status accordingly in database
      
      return NextResponse.json({ RspCode: '00', Message: 'Confirm success' });
    }
  } catch (error) {
    console.error('Error processing VNPay IPN:', error);
    return NextResponse.json({ RspCode: '99', Message: 'Unknown error' });
  }
}

// Handle GET requests as well (some IPN might come as GET)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params: Record<string, string | number> = {};
    
    // Convert URLSearchParams to object
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Verify the IPN signature
    const isValid = vnpayService.verifyIpnUrl({ ...params });
    
    if (!isValid) {
      return NextResponse.json({ RspCode: '97', Message: 'Invalid signature' });
    }

    const vnp_ResponseCode = params.vnp_ResponseCode;
    const vnp_TxnRef = params.vnp_TxnRef;
    const vnp_Amount = params.vnp_Amount;
    const vnp_TransactionNo = params.vnp_TransactionNo;
    const vnp_TransactionStatus = params.vnp_TransactionStatus;

    console.log('VNPay IPN GET received:', {
      orderId: vnp_TxnRef,
      responseCode: vnp_ResponseCode,
      transactionStatus: vnp_TransactionStatus,
      amount: vnp_Amount,
      transactionNo: vnp_TransactionNo
    });

    // TODO: Same database update logic as POST handler

    return NextResponse.json({ RspCode: '00', Message: 'Confirm success' });
  } catch (error) {
    console.error('Error processing VNPay IPN GET:', error);
    return NextResponse.json({ RspCode: '99', Message: 'Unknown error' });
  }
} 