import { useFormStatus } from 'react-dom';

export function SubmitButton({ mode }: { mode: 'login' | 'register' }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {pending ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
    </button>
  );
}
