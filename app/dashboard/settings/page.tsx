import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue, SelectTrigger } from '@/components/ui/select'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma  from "../../lib/db";

import SubmitButton from '@/app/_components/SubmitButton';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';


async function getData(userId: string){
  noStore();
  const userData = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select:{
      name: true,
      email: true,
      colorScheme: true
    }
  })
  return userData
}

export default async function SettingsPage() {

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userData = await getData(user?.id as string);

  async function handleSubmit(formData: FormData) {
    'use server'
    const name = formData.get('name') as string;
    const colorScheme = formData.get('colorScheme') as string;

    await prisma.user.update({
      where: {
        id: user?.id as string
      },
      data: {
        name,
        colorScheme
      }
    })
    revalidatePath('/', 'layout')
  }
  

  return (
    <div className='grid items-start gap-8'>
      <div className='flex items-center justify-between px-2'>
        <div className='grid gap-1'>
          <h1 className='text-3xl md:text-4xl font-bold'>Settings</h1>
          <p className='text-lg text-muted-foreground'>Your profile settings</p>

        </div>
      </div>
      <Card >
        <form action={handleSubmit}>
          <CardHeader>
            <CardTitle>General Data</CardTitle>
            <CardDescription>
              Please provide general information about yourself. please dont forget to save.
            </CardDescription>  
            
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
                <div className='space-y-2'>
                  <Label>Your Name</Label>
                  <Input
                    type='text'
                    defaultValue={userData?.name as string || ''}
                    placeholder='Your Name'
                    id="name"
                    name="name"
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Your Email</Label>
                  <Input
                    type='email'
                    defaultValue={userData?.email as string || ''}
                    placeholder='test@email.com'
                    id="email"
                    name="email"
                    disabled
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='space-y-2'>Color Theme</Label>
                  <Select name='colorScheme' defaultValue={userData?.colorScheme as string || ''}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Pick a scheme color'  />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Color Scheme</SelectLabel>
                        <SelectItem value='theme-rose'>Rose</SelectItem>
                        <SelectItem value='theme-zinc'>Zinc</SelectItem>
                        <SelectItem value='theme-blue'>Blue</SelectItem>
                        <SelectItem value='theme-green'>Green</SelectItem>
                        <SelectItem value='theme-orange'>Orange</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-end'>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
