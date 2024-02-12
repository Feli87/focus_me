import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_KEY as string,{
    apiVersion: '2023-10-16',
    typescript: true
});

export const getStripeSession = async ({
    priceId,
    domainUrl,
    customerId
}:{
    priceId: string;
    domainUrl: string;
    customerId?: string
})=>{
    // let productM20Id = process.env.STRIPE_PRODUCT_M20_ID as string;
    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        billing_address_collection: 'auto',
        line_items: [
            {
                price: priceId,
                quantity: 1

            }
        ],
        payment_method_types: [
            'card'
        ],
        customer_update: {
            address: 'auto',
            name: 'auto'
        },
        allow_promotion_codes: true,
        success_url: `${domainUrl}/payment/success`,
        cancel_url: `${domainUrl}/payment/cancelled`
    });

    return session.url as string

}