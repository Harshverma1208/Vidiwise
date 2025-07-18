/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";

import type { Stripe } from "stripe";

import { headers } from "next/headers";

import { stripe } from "~/lib/stripe/server";
import { formatAmountForStripe } from "~/app/_utils";
import values from "~/config";



export async function createCheckoutSession(
  data: FormData
): Promise<{ client_secret: string | null; url: string | null }> {
 
 const { CURRENCY } = values;
    
  const ui_mode = data.get(
    "uiMode"
  ) as Stripe.Checkout.SessionCreateParams.UiMode;

  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  const origin: string = headers().get("origin") as string;

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "pay",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: "Buy me coffee",
            },
            unit_amount: formatAmountForStripe(
              Number(data.get("template_price") as string),
              CURRENCY
            ),
          },
        },
      ],
      ...(ui_mode === "hosted" && {
        success_url: `${origin}`,
        // success_url: `${origin}/stripe-with-checkout?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}`,
      }),
      ...(ui_mode === "embedded" && {
        return_url: `${origin}?session_id={CHECKOUT_SESSION_ID}`,
      }),
      ui_mode,
    });


  // console.log("Debugging", checkoutSession)

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

export async function createPaymentIntent(
  data: FormData
): Promise<{ client_secret: string }> {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: formatAmountForStripe(
        Number(data.get("template_price") as string),
        CURRENCY
      ),
      automatic_payment_methods: { enabled: true },
      currency: CURRENCY,
    });

  return { client_secret: paymentIntent.client_secret as string };
}