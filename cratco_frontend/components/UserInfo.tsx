"use client";
import {useAuth} from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';

export default function UserInfo() {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push('/'); // Redirect after successful auth
    }
    return (
        <div>
            <p>Hello there!</p>
            <button onClick={handleLogout} className="my-4 btn btn-secondary">Logout</button>
        </div>
    );
}
