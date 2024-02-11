"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { navItems } from "./DashboardNav";
import Link from "next/link";
import {
    LogoutLink
} from "@kinde-oss/kinde-auth-nextjs/components";
import { DoorClosed } from "lucide-react";

export default function UserNavbar({user}: any) {


    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative w-10 h-10 rounded-full" >
                    <Avatar className="w-10 h-10 rounded-full">
                        <AvatarImage src={user?.picture} alt="Your Name" />
                        <AvatarFallback>{user.given_name[0]}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 mt-2 bg-card text-card-foreground border border-card-border rounded-md"
                align="end"
            
            >
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none mb-1">
                            {user.given_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {navItems.map((item, index) => (
                        <DropdownMenuItem
                            key={index}
                            asChild
                        >
                            <Link
                                className="w-full flex justify-between items-center cursor-pointer
                                hover:bg-accent hover:text-accent-foreground
                                "
                                href={item.href}
                            >
                                {item.name}
                                <span>
                                    <item.icon className="ml-2 h-4 w-4" />
                                </span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="w-full flex justify-between items-center">
                <LogoutLink className="w-full">
                    <Button className="w-full flex justify-center text-center items-center" variant="ghost">
                        Logout
                        <span>
                            <DoorClosed className="ml-2 h-4 w-4" />
                        </span>
                    </Button>
                </LogoutLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
