import { NextRequest, NextResponse } from 'next/server';
import { vnpayService } from '@/services/vnpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, orderInfo, orderId } = body;

    if (!amount || !orderInfo || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, orderInfo, orderId' },
        { status: 400 }
      );
    }

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    console.log("forwarded", forwarded);
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '127.0.0.1';
    console.log("ip", ip);
    const paymentUrl = vnpayService.createPaymentUrl({
      amount: parseInt(amount),
      orderInfo,
      orderId,
      ipAddr: ip,
      locale: 'vn',
      currCode: 'VND',
      orderType: 'other'
    });

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error('Error creating VNPay payment URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 