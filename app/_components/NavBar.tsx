import Link from 'next/link'
import * as React from 'react'
import { ModeToggle } from './ModeToggle'
import AuthNavbarButtons from './AuthnavbarButtons'

export default async function NavBar() {

    return (
        <nav className="flex items-center border-b bg-background h-[8vh]">
            <div className="container flex items-center justify-between">
                <Link className="text-2xl font-bold" href="/">Focus <span className='text-primary'>Me</span></Link>
                <div className="flex items-center gap-x-5">
                    <ModeToggle />
                    <AuthNavbarButtons />
                </div>
            </div>
        </nav>
    )

}
