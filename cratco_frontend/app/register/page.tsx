import { AuthForm } from '@/components/AuthForm';
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-blend-darken py-12">
            <AuthForm mode="register" />
            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:text-blue-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}