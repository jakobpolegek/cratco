'use client';

import Link from "next/link";
import {useAuth} from "@/contexts/AuthContext";

export const NavigationBar = () => {
    const { user } = useAuth();
    return (
    <div id="navigation-bar" className="flex gap-6 mt-10 items-center justify-center">
        {user &&
        <>
            <Link href="/">Home</Link>
            <Link href="/my-links" className="text-2xl mb-1 font-extrabold">{user.name}</Link>
            <Link href="/about">About</Link>
        </>}
    </div>);
}