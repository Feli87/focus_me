'use client'
import React from 'react' 
import {CreditCard, Home, Settings} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export const navItems = [
    {
        name: 'Home',
        href: '/dashboard',
        icon: Home
    },
    {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: Settings
    },
    {
        name: 'Billing',
        href: '/dashboard/billing',
        icon: CreditCard
    }
]
export default function DashboardNav() {

    const pathname = usePathname();

    return (
    <div className='grid items-start gap-2'>
        {navItems.map((item, index) => (
            <Link key={index} href={item.href}>
                <span className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href && "bg-accent text-accent-foreground"
                )}>
                    <item.icon className="mr-2 h-4 w-4 text-primary" />
                    <span>{item.name}</span>
                </span>
            </Link>
        ))}
    </div>
    )
}
