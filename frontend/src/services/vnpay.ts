import crypto from 'crypto';

export interface VNPayConfig {
  vnp_TmnCode: string;
  vnp_HashSecret: string;
  vnp_Url: string;
  vnp_ReturnUrl: string;
  vnp_IpnUrl: string;
}

export interface PaymentRequest {
  amount: number;
  orderInfo: string;
  orderId: string;
  ipAddr: string;
  locale?: string;
  currCode?: string;
  orderType?: string;
}

export class VNPayService {
  private config: VNPayConfig;

  constructor() {
    this.config = {
      vnp_TmnCode: process.env.VNPAY_TMN_CODE || '5L9D32IG',
      vnp_HashSecret: process.env.VNPAY_HASH_SECRET || 'S23ULVO8ZVREHTU94XIVGXTB68BWTR5T',
      vnp_Url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      vnp_ReturnUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://b043a1a6f741.ngrok-free.app'}/api/vnpay/return`,
      vnp_IpnUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://b043a1a6f741.ngrok-free.app'}/api/vnpay/ipn`,
    };
  }

  private sortObject(obj: Record<string, string | number>): Record<string, string | number> {
    const sorted: Record<string, string | number> = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  private createSecureHash(params: Record<string, string | number>): string {
    const sortedParams = this.sortObject(params);
    const signData = new URLSearchParams(sortedParams as Record<string, string>).toString();
    const hmac = crypto.createHmac('sha512', this.config.vnp_HashSecret);
    return hmac.update(signData, 'utf-8').digest('hex');
  }

  createPaymentUrl(paymentRequest: PaymentRequest): string {
    const createDate = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14);
    
    const vnpParams: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.config.vnp_TmnCode,
      vnp_Amount: paymentRequest.amount * 100, // VNPay requires amount in VND cents
      vnp_CurrCode: paymentRequest.currCode || 'VND',
      vnp_TxnRef: paymentRequest.orderId,
      vnp_OrderInfo: paymentRequest.orderInfo,
      vnp_OrderType: paymentRequest.orderType || 'other',
      vnp_Locale: paymentRequest.locale || 'vn',
      vnp_ReturnUrl: this.config.vnp_ReturnUrl,
      vnp_IpAddr: paymentRequest.ipAddr,
      vnp_CreateDate: createDate,
    };

    // Create secure hash
    const secureHash = this.createSecureHash(vnpParams);
    const paramsWithHash = { ...vnpParams, vnp_SecureHash: secureHash };

    // Build payment URL
    const query = new URLSearchParams(paramsWithHash as Record<string, string>).toString();
    return `${this.config.vnp_Url}?${query}`;
  }

  verifyReturnUrl(params: Record<string, string | number>): boolean {
    const secureHash = params.vnp_SecureHash as string;
    const paramsWithoutHash = { ...params };
    delete paramsWithoutHash.vnp_SecureHash;
    delete paramsWithoutHash.vnp_SecureHashType;

    const calculatedHash = this.createSecureHash(paramsWithoutHash);
    return secureHash === calculatedHash;
  }

  verifyIpnUrl(params: Record<string, string | number>): boolean {
    return this.verifyReturnUrl(params);
  }
}

export const vnpayService = new VNPayService();

