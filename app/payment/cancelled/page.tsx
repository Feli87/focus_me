import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { XIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function CancelledPaymentPage() {
    return (
        <div className='w-full min-h-[80vh] flex items-center justify-center'>
            <Card className='w-full max-w-md p-4'>
                <div className='p-6'>
                    <div className='flex items-center justify-center'>
                        <XIcon className='w-10 h-10 bg-red-500/30 p-2 rounded-full text-red-500 '/>
                    </div>
                    <div className='mt-3 text-center sm:mt-5 w-full'>
                        <h3 className='text-lg font-medium leading-6 text-red-500'>
                            Payment Failed
                        </h3>
                        <div classname-='mt-2'>
                            <p className='text-sm text-muted-foreground'>
                            Please Try again
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
