export interface PaymentRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: "USD" | "DOP";
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  returnUrl: string;
  cancelUrl: string;
  metadata?: Record<string, any>;
}

export interface PaymentInitResult {
  paymentId: string;
  redirectUrl?: string; // URL for 3DS or Hosted Checkout (AZUL Page / Link)
  postParams?: Record<string, string>; // Form POST payload if gateway uses HTTP POST redirection
  status: "PENDING" | "AUTHORIZED" | "PAID" | "FAILED";
  rawResponse?: any;
}

export interface PaymentVerificationResult {
  isVerified: boolean;
  orderId: string;
  transactionId: string;
  authorizationCode?: string;
  status: "PAID" | "FAILED" | "PENDING" | "CANCELLED";
  errorMessage?: string;
  rawResponse?: any;
}

export interface IPaymentProvider {
  name: string;
  createPayment(req: PaymentRequest): Promise<PaymentInitResult>;
  verifyPayment(payload: any): Promise<PaymentVerificationResult>;
  refundPayment(transactionId: string, amount?: number): Promise<{ success: boolean; refundId?: string; error?: string }>;
  getPaymentStatus(transactionId: string): Promise<"PAID" | "PENDING" | "FAILED">;
}
