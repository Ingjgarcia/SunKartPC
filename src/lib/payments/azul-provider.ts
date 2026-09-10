import crypto from "crypto";
import { IPaymentProvider, PaymentInitResult, PaymentRequest, PaymentVerificationResult } from "./types";

export interface AzulConfig {
  merchantId: string;
  merchantName: string;
  authKey: string;
  environment: "TEST" | "PRODUCTION";
  apiUrl: string;
}

export class AzulPaymentProvider implements IPaymentProvider {
  name = "AZUL";
  private config: AzulConfig;

  constructor(config?: Partial<AzulConfig>) {
    this.config = {
      merchantId: config?.merchantId || process.env.AZUL_MERCHANT_ID || "39000000000",
      merchantName: config?.merchantName || process.env.AZUL_MERCHANT_NAME || "SunKart Park Punta Cana",
      authKey: config?.authKey || process.env.AZUL_AUTH_KEY || "00000000000000000000000000000000",
      environment: (config?.environment || process.env.AZUL_ENVIRONMENT || "TEST") as "TEST" | "PRODUCTION",
      apiUrl:
        config?.apiUrl ||
        process.env.AZUL_API_URL ||
        "https://pruebas.azul.com.do/PaymentPage/",
    };
  }

  /**
   * Generates HMAC-SHA512 AuthHash required by Banco Popular / AZUL
   */
  generateAuthHash(params: {
    merchantId: string;
    merchantName: string;
    merchantType: string;
    currencyCode: string;
    orderNumber: string;
    amount: string; // "150000" for 1500.00
    itbis: string;
    approvedUrl: string;
    declinedUrl: string;
    cancelUrl: string;
  }): string {
    const rawString = [
      params.merchantId,
      params.merchantName,
      params.merchantType,
      params.currencyCode,
      params.orderNumber,
      params.amount,
      params.itbis,
      params.approvedUrl,
      params.declinedUrl,
      params.cancelUrl,
    ].join("");

    return crypto
      .createHmac("sha512", this.config.authKey)
      .update(rawString)
      .digest("hex");
  }

  async createPayment(req: PaymentRequest): Promise<PaymentInitResult> {
    // Format amount into cents (e.g. 99.00 -> 9900)
    const amountInCents = Math.round(req.amount * 100).toString();
    const itbisInCents = Math.round((req.amount * 0.18 / 1.18) * 100).toString();
    const currencyCode = req.currency === "USD" ? "$00" : "$01"; // Standard AZUL codes: $00 USD, $01 DOP

    const postParams: Record<string, string> = {
      MerchantId: this.config.merchantId,
      MerchantName: this.config.merchantName,
      MerchantType: "ecommerce",
      CurrencyCode: currencyCode,
      OrderNumber: req.orderNumber,
      Amount: amountInCents,
      ITBIS: itbisInCents,
      ApprovedUrl: req.returnUrl,
      DeclinedUrl: req.cancelUrl,
      CancelUrl: req.cancelUrl,
      CustomCode: req.orderId,
    };

    postParams.AuthHash = this.generateAuthHash({
      merchantId: postParams.MerchantId,
      merchantName: postParams.MerchantName,
      merchantType: postParams.MerchantType,
      currencyCode: postParams.CurrencyCode,
      orderNumber: postParams.OrderNumber,
      amount: postParams.Amount,
      itbis: postParams.ITBIS,
      approvedUrl: postParams.ApprovedUrl,
      declinedUrl: postParams.DeclinedUrl,
      cancelUrl: postParams.CancelUrl,
    });

    return {
      paymentId: `AZUL_INIT_${req.orderNumber}`,
      redirectUrl: this.config.apiUrl,
      postParams,
      status: "PENDING",
    };
  }

  async verifyPayment(payload: any): Promise<PaymentVerificationResult> {
    const isoCode = payload.IsoCode || payload.isoCode || "";
    const isApproved = isoCode === "00";

    return {
      isVerified: true,
      orderId: payload.CustomCode || payload.orderId || "",
      transactionId: payload.OrderNumber || payload.transactionId || "",
      authorizationCode: payload.AuthorizationCode || payload.authCode,
      status: isApproved ? "PAID" : "FAILED",
      errorMessage: isApproved ? undefined : payload.ResponseMessage || "Transacción no aprobada por el emisor.",
      rawResponse: payload,
    };
  }

  async refundPayment(transactionId: string, amount?: number) {
    return {
      success: true,
      refundId: `AZUL_REF_${Date.now()}`,
    };
  }

  async getPaymentStatus(transactionId: string): Promise<"PAID" | "PENDING" | "FAILED"> {
    return "PENDING";
  }
}
