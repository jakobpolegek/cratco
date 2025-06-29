import { AuthForm } from '@/components/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen py-12">
      <AuthForm mode="login" />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Need an account?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
