import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import React from 'react'
import prisma  from "../../lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getStripeSession, stripe } from '@/app/lib/stripe';
import { redirect } from 'next/navigation';
import SusbscriptionStripeButton from '@/app/_components/SusbscriptionStripeButton';
import EditSusbscriptionStripeButton from '@/app/_components/EditSusbscriptionStripeButton';
import {unstable_noStore as noStore} from 'next/cache'
const feactureItems = [
    {
        name: 'Access your notes anytime',
    },
    {
        name: 'Assets in your notes',
    },
    {
        name: 'Cloud storage for your notes',
    },
    {
        name: '15 collaborators in your notes',
    }
];

async function getData(userId: string){
  noStore();
  const userData = await prisma.subscription.findUnique({
    where: {
      userId: userId
    },
    select:{
      status: true,
      user:{
        select:{
          stripeCustomerId: true
        }
      }

    }
  });
  return userData
}

export default async function Billingpage() {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
  const data = await getData(user?.id as string);
 
  async function createSubscription(){
    'use server'

    const dbUser = await prisma.user.findUnique({
      where:{
        id: user?.id
      },
      select:{
        stripeCustomerId: true
      }
    });

    if(!dbUser?.stripeCustomerId){
      throw new Error('Stripe Customer Id not found')
    }
    
    const subscriptionUrl = await getStripeSession({
      customerId:dbUser?.stripeCustomerId as string,
      priceId: process.env.STRIPE_PRODUCT_M20_ID as string,
      domainUrl:'http://localhost:5000'

    });

    return redirect(subscriptionUrl)

  }

  async function createCustomerPortal(){
    'use server'
    const session = await stripe.billingPortal.sessions.create({
      customer: data?.user?.stripeCustomerId as string,
      return_url: 'http://localhost:5000/dashboard'
    });

    return redirect(session.url)
  }


  if(data?.status === 'active'){
    return (
      <div className='grid items-start gap-8'>
        <div className='flex items-center justify-between px-2 '>
          <div className='grid gap-1'>
            <h1 className='text-3xl md:text-4xl font-semibold tracking-tight'>Your Subscription</h1>
            <p className='text-lg text-muted-foreground px-2'>Manage your subscription</p>
          </div>
        </div>
        <Card>
          <CardHeader className='w-full lg:w-2/3'>
            <CardTitle>Edit Subscription</CardTitle>
            <CardDescription>Please click the button below to either edit your subscription or view its current status.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCustomerPortal}>
              <EditSusbscriptionStripeButton/>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className='max-w-md mx-auto space-y-4'> 
        <Card className='flex flex-col'>
          <CardContent className='py-8'>
            <div>
            <h3 className='inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary/10 text-primary'>Monthly</h3>
            </div>
            <div className='mt-4 flex items-baseline text-6xl font-extrabold'>
              $20 <span className='ml-1 text-2xl text-text-muted-foreground'>/mo</span>
            </div>
            <p className='mt-4 text-sm text-muted-foreground'>
              Write as many notes as you want for $20 a Month
            </p>
          </CardContent>
          <div className='flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p10'>
            <ul className='space-y-4 '>
              {feactureItems.map((item) => (
                <li key={item.name} className='flex items-center '>
                  <div className='flex-shrink-0'>
                    <CheckCircle2 className='w-5 h-5 text-primary' />
                  </div>
                  <p className='ml-3 text-sm'> {item.name}</p>
                </li>
              ))}

            </ul>
            <form className='w-full' action={createSubscription}>
              <SusbscriptionStripeButton />
            </form>
          </div>
        </Card>
    </div>
  )
}
