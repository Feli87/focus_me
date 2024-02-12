import { stripe } from "@/app/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "../../../lib/db";

export async function POST(request: Request) {
    const body = await request.text();

    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {

        event = stripe.webhooks.constructEvent(
            body, 
            signature, 
            process.env.STRIPE_WEBHOOK_SECRET as string
            );
        
    } catch (error: unknown) {
        return new Response("Webhook Error", { status: 400 });
    }
    const session = event.data.object as Stripe.Checkout.Session;

    if(event.type === 'checkout.session.completed'){
        console.log('Checkout session completed', session.id);
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );
        const customerId = String(session.customer);
        const user = await prisma.user.findUnique({
            where: {
                stripeCustomerId: customerId
            }
        });

        if(!user){
            throw new Error('User not found');
        }

        await prisma.subscription.create({
            data:{
                stripeSubscriptionid: subscription.id,
                userId: user.id,
                currentPeriodStart: subscription.current_period_start,
                currentPeriodEnd: subscription.current_period_end,
                status: subscription.status,
                planId: subscription.items.data[0].plan.id,
                interval: String(subscription.items.data[0].plan.interval)
            }
        })
    }
    if(event.type === 'invoice.paid'){
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        await prisma.subscription.update({
            where:{
                stripeSubscriptionid: subscription.id,

            },
            data:{
                planId: subscription.items.data[0].plan.id,
                currentPeriodStart: subscription.current_period_start,
                currentPeriodEnd: subscription.current_period_end,
                status: subscription.status
            }
        })
    }
    return new Response(null, { status: 200 });
}