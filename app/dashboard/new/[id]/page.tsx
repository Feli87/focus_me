import SubmitButton from '@/app/_components/SubmitButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import React from 'react'
import prisma from '../../../lib/db';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'

async function getData({noteId, userId}:{noteId: string, userId: string}) {
    noStore();
    const data = await prisma.note.findUnique({
        where:{
            id: noteId,
            userId: userId
        },
        select:{
            title: true,
            description: true,
            id: true
        }
    })
    return data
}

async function handleSubmit(formData: FormData){
    'use server'
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const userId = formData.get('userId') as string;
    const noteId = formData.get('noteId') as string;
    await prisma.note.update({
        where:{
            id: noteId as string,
            userId: userId as string
        },
        data:{
            title,
            description
        }
    });
    revalidatePath('/dashboard')
    redirect('/dashboard')
}


export default async function EditPage({params}: {params: {id: string}}) {

    const { getUser } = getKindeServerSession();
	const user = await getUser();

    const noteData = await getData({userId: user?.id as string, noteId: params?.id as string})
    return (
        <Card>
            <form action={handleSubmit}>
                <CardHeader>
                    <CardTitle>Edit Note</CardTitle>
                    <CardDescription>Here you can edit your note</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-y-5'>
                    <div className='gap-y-2 flex flex-col'>
                        <Label>Title</Label>
                        <Input
                            type='text'
                            placeholder='Note Title'
                            className='w-full'
                            defaultValue={noteData?.title as string}
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
                            defaultValue={noteData?.description as string}
                            name='description'
                            rows={6}
                        />
                    </div>
                    <Input
                        type='hidden'
                        name='userId'
                        defaultValue={user?.id}
                    />
                        <Input
                        type='hidden'
                        name='noteId'
                        defaultValue={params?.id}
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
