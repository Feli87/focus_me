import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, SubscriptIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function SuccessPaymentPage() {
  return (
    <div className='w-full min-h-[80vh] flex items-center justify-center'>
    <Card className='w-full max-w-md p-4'>
        <div className='p-6'>
            <div className='flex items-center justify-center'>
                <Check className='w-10 h-10 bg-green-500/30 p-2 rounded-full text-green-500 '/>
            </div>
            <div className='mt-3 text-center sm:mt-5 w-full'>
                <h3 className='text-lg font-medium leading-6 text-green-500'>
                    Payment Successfull
                </h3>
                <div classname-='mt-2'>
                    <p className='text-sm text-muted-foreground'>
                    tank you for your payment
                    </p>
                </div>
                <div className='mt-5 sm:mt-6'>
                    <Button className='w-full ' asChild>
                        <Link href='/'>Go back to Dashboard</Link>
                    </Button>
                </div>

            </div>
        </div>
    </Card>
</div>
  )
}
