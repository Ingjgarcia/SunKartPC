/**
 * Payment Provider Abstraction for AdventureOS
 * Allows switching between MockProvider, Azul (Dominican Republic), and future gateways (Stripe, CardNET).
 */

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
  redirectUrl?: string;     // URL for 3DS or Hosted Checkout (AZUL Page / Link)
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

/**
 * Mock Provider for Demo Mode & Local Testing
 */
export class MockPaymentProvider implements IPaymentProvider {
  name = "MOCK";

  async createPayment(req: PaymentRequest): Promise<PaymentInitResult> {
    const paymentId = `MOCK_TX_${Date.now()}`;
    // In demo mode, redirect to instant success or mock selection page
    return {
      paymentId,
      redirectUrl: `${req.returnUrl}?paymentId=${paymentId}&status=APPROVED`,
      status: "PENDING"
    };
  }

  async verifyPayment(payload: any): Promise<PaymentVerificationResult> {
    const isApproved = payload.status !== "DECLINED";
    return {
      isVerified: true,
      orderId: payload.orderId || "unknown",
      transactionId: payload.paymentId || `MOCK_TX_${Date.now()}`,
      authorizationCode: "MOCK_AUTH_8888",
      status: isApproved ? "PAID" : "FAILED",
      errorMessage: isApproved ? undefined : "Card declined in simulated demo mode"
    };
  }

  async refundPayment(transactionId: string, amount?: number) {
    return { success: true, refundId: `MOCK_REF_${Date.now()}` };
  }

  async getPaymentStatus(transactionId: string): Promise<"PAID" | "PENDING" | "FAILED"> {
    return "PAID";
  }
}
