'use client'
import { Button } from '@/components/ui/button'
import { Edit2, Loader2 } from 'lucide-react'
import React from 'react'
import { useFormStatus } from 'react-dom'

export default function DeleteNoteButton() {
    const {pending} = useFormStatus()
    return (
        <>
        {pending ? (
            <Button disabled className='w-fil'><Loader2 className='mr-2 h-4 w-4 animate-spin'/>Deleting Note</Button>
        ):(
            <Button type='submit' variant='link' size={'icon'} className='px-2 w-[80px]'>
                <Edit2 className='h-3 w-3 mx-2' />
                Edit
            </Button>
        )}        
        </>
    )
}
