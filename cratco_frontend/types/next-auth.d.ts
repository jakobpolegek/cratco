import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    customToken?: string;
  }
}

declare module 'next-auth' {
  interface User extends DefaultUser {
    customToken?: string;
  }

  interface Session {
    customToken?: string;
    user: {
      id?: string;
    } & DefaultSession['user'];
  }
}
