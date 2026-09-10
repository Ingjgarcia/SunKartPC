import { IPaymentProvider } from "./types";
import { MockPaymentProvider } from "./mock-provider";
import { AzulPaymentProvider } from "./azul-provider";

export * from "./types";
export * from "./mock-provider";
export * from "./azul-provider";

export class PaymentFactory {
  private static mockInstance = new MockPaymentProvider();
  private static azulInstance = new AzulPaymentProvider();

  static getProvider(providerName?: string): IPaymentProvider {
    const defaultProvider = process.env.PAYMENT_DEFAULT_PROVIDER || "MOCK";
    const selected = (providerName || defaultProvider).toUpperCase();

    if (selected === "AZUL") {
      return this.azulInstance;
    }

    return this.mockInstance;
  }
}
