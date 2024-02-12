import SubmitButton from '@/app/_components/SubmitButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import React from 'react'
import prisma from '../../lib/db';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import {revalidatePath, unstable_noStore as noStore} from 'next/cache'
import { redirect } from 'next/navigation'
export default async function CreateNewNote() {
    noStore();
    const { getUser } = getKindeServerSession();
	const user = await getUser();

    async function handleSubmit(formData: FormData){
        'use server'
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const userId = formData.get('userId') as string;

        await prisma.note.create({
            data:{
                userId: userId,
                title,
                description
            }
        })

        revalidatePath('/dashboard')
        redirect('/dashboard')
    }
    return (
        
        <Card>
            <form action={handleSubmit}>
                <CardHeader>
                    <CardTitle>New Note</CardTitle>
                    <CardDescription>Here you can create a new note</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-y-5'>
                    <div className='gap-y-2 flex flex-col'>
                        <Label>Title</Label>
                        <Input
                            type='text'
                            placeholder='Note Title'
                            className='w-full'
                            required
                            name='title'
                        />
                    </div>
                    <div className='gap-y-2 flex flex-col'>
                        <Label>Description</Label>
                        <Textarea
                            placeholder='Note Description'
                            className='w-full'
                            required
                            name='description'
                            rows={6}
                        />
                    </div>
                    <Input
                        type='hidden'
                        name='userId'
                        defaultValue={user?.id}
                    />
                    <CardFooter className='flex justify-between gap-x-2'>
                        <Button variant='destructive' asChild>
                            <Link href='/dashboard'>Cancel</Link>
                        </Button>
                        <SubmitButton />
                    </CardFooter>
                </CardContent>
            </form>
        </Card>
    )
}
