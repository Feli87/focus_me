import { Button } from '@/components/ui/button'
import Link from 'next/link'
import prisma  from "../lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {  File, Trash2 } from 'lucide-react';
import DeleteNoteButton from '@/app/_components/DeleteNoteButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { revalidatePath } from 'next/cache';
import { Input } from '@/components/ui/input';
import { unstable_noStore as noStore } from 'next/cache';
async function getData(userId: string) {
    noStore();
    if(!userId){
        throw new Error('User not found');
    }
    const data = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            Notes: true,
            subscriptions:{
                select:{
                    status: true
                }
            }
        }
    });

    return data;
}

async function deleteNote(formData: FormData){
    'use server'
    const noteId = formData.get('noteId') as string;
    const userId = formData.get('userId') as string;
    await prisma.note.delete({
        where:{
            id: noteId,
            userId: userId
        }
    })
    revalidatePath('/dashboard')
}
export default async function page() {

    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const notesData = await getData(user?.id as string);

    // if(notesData?.subscriptions?.status != 'active'){
    //     redirect('/dashboard/billing')
    // }
    return (
        <div className='grid items-start gap-y-8'>
            <div className='flex items-center justify-between px-2'>
                <div className='grid gap-1'>
                    <h1 className='text-3xl md:text-4xl font-semibold tracking-tight'>Your Notes</h1>
                    <p className='text-muted-foreground px-1'>Here you can see and create new Notes</p>
                </div>
                {notesData?.Notes?.length > 3 && notesData?.subscriptions?.status != 'active' ? (
                    <Button asChild>
                        <Link href='/dashboard/billing'>Upgrade your plan</Link>
                    </Button>
                ):(
                    <Button asChild>
                    <Link href='/dashboard/new'>Create a new Note</Link>
                </Button>
                )}
            </div>
            {notesData?.Notes?.length == 0  ? (
                <div className='flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50'>
                    <div className='flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 '>
                        <File className='mx-auto h-12 w-12 text-primary' />
                    </div>
                    <h1 className='mt-4 text-lg font-semibold'>You dont have any notes</h1>
                    <p className='mt-1 text-sm text-muted-foreground mb-4 text-center'>Please create some so that you can see them rigth here.</p>
                    {notesData?.Notes?.length > 3 && notesData?.subscriptions?.status != 'active' ? (
                    <Button asChild>
                        <Link href='/dashboard/billing'>Upgrade your plan</Link>
                    </Button>
                    ):(
                        <Button asChild>
                        <Link href='/dashboard/new'>Create a new Note</Link>
                        </Button>
                    )}
                
                </div>
            ):(
                <div className='grid gap-4'>
                    {notesData?.Notes.map((note, index) => (
                        <Card key={`note-${index}`}>
                            <CardHeader>
                                <CardTitle>
                                    <span className='text-xl font-semibold'>{note.title}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{note.description}</p>
                            </CardContent>
                            <CardFooter>
                            <div className='flex w-full items-center justify-between'>
                                <span className='text-sm text-muted-foreground'>
                                {note.createdAt.toLocaleDateString(
                                    'en-US',
                                    {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }
                                )}
                                </span>
                                
                                <div className='flex'>
                                    <form action={deleteNote}>
                                        <Input
                                            type='hidden'
                                            name='userId'
                                            defaultValue={user?.id}
                                        />
                                            <Input
                                            type='hidden'
                                            name='noteId'
                                            defaultValue={note?.id}
                                        />
                                        <Button variant='link' size={'icon'} className='px-2 w-[100px] text-red-500'>
                                            <Trash2 className='h-3 w-3 mx-2 ' />
                                            Delete
                                        </Button>
                                    </form>
                                    <Link href={`/dashboard/new/${note.id}`}>
                                        <DeleteNoteButton />
                                    </Link>
                                    
                                </div>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
