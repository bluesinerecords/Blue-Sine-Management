export interface PaymentProvider {
  createPaymentRequest(input: { invoiceId: string; amount: number; currency: string }): Promise<{ status: 'simulated' | 'created'; reference: string; url?: string }>;
  verifyWebhook(input: { payload: unknown; signature?: string }): Promise<{ verified: boolean; invoiceId?: string; amount?: number; reference?: string }>;
}

export class MockPaymentProvider implements PaymentProvider {
  async createPaymentRequest(input: { invoiceId: string; amount: number; currency: string }) {
    return { status: 'simulated' as const, reference: `mock-${input.invoiceId}`, url: `/development/payments/${input.invoiceId}` };
  }
  async verifyWebhook() { return { verified: false }; }
}
