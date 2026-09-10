import { IPaymentProvider, PaymentInitResult, PaymentRequest, PaymentVerificationResult } from "./types";

/**
 * Mock Provider for AdventureOS Demo Mode & Offline Testing
 */
export class MockPaymentProvider implements IPaymentProvider {
  name = "MOCK";

  async createPayment(req: PaymentRequest): Promise<PaymentInitResult> {
    const paymentId = `MOCK_TX_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    return {
      paymentId,
      redirectUrl: `${req.returnUrl}?paymentId=${paymentId}&status=APPROVED`,
      status: "PENDING",
    };
  }

  async verifyPayment(payload: any): Promise<PaymentVerificationResult> {
    const isApproved = payload.status !== "DECLINED";
    return {
      isVerified: true,
      orderId: payload.orderId || "unknown",
      transactionId: payload.paymentId || `MOCK_TX_${Date.now()}`,
      authorizationCode: "AUTH_MOCK_889900",
      status: isApproved ? "PAID" : "FAILED",
      errorMessage: isApproved ? undefined : "Transacción rechazada por el banco en modo demostración.",
      rawResponse: {
        provider: "MOCK",
        timestamp: new Date().toISOString(),
        payload,
      },
    };
  }

  async refundPayment(transactionId: string, amount?: number) {
    return {
      success: true,
      refundId: `MOCK_REF_${Date.now()}`,
    };
  }

  async getPaymentStatus(transactionId: string): Promise<"PAID" | "PENDING" | "FAILED"> {
    return "PAID";
  }
}
