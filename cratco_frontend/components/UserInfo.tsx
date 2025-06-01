"use client";
import {useAuth} from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';

export default function UserInfo() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push('/'); // Redirect after successful auth
    }
    return (
        <div>
            <p>Hello {user?.name}!</p>
            <button onClick={handleLogout} className="bg-blue-500">Logout</button>
        </div>
    );
}
