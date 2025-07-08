'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserInfo() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  return (
    <div className="mx-auto flex flex-col text-center items-center bg-base-100 rounded-box shadow-md lg:fixed lg:top-30 lg:left-10 w-4/5 lg:w-auto ">
      <p className="mt-4 text-xl uppercase font-semibold text-white opacity-80 tracking-wid px-4">
        <img
          src="https://media1.tenor.com/m/Tsob5aHiS3UAAAAC/hello-there.gif"
          alt="hello"
          className="w-48 h-48"
        />
      </p>
      <button
        onClick={handleLogout}
        className="my-4 btn btn-secondary w-20 p- lg:w-auto"
      >
        Logout
      </button>
    </div>
  );
}
