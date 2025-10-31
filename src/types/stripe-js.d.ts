import type { Stripe } from "@stripe/stripe-js";

declare module "@stripe/stripe-js" {
  interface Stripe {
    redirectToCheckout(params: { sessionId: string }): Promise<{ error?: { message: string } }>;
  }
}
