import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials.");
                }

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SRC}/auth/sign-in`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        }),
                    });

                    if (!response.ok) {
                        throw new Error("Backend returned error.");
                    }

                    const { data } = await response.json();

                    if (!data?.user?._id || !data?.token) {
                        throw new Error("Invalid response from backend.");
                    }

                    return {
                        id: data.user._id,
                        email: data.user.email,
                        name: data.user.name || "",
                        customToken: data.token
                    };
                } catch (error) {
                    throw new Error(`Authorization error: ${error}`);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                token.id = user.id;

                if (account.provider === "google") {
                    try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_SRC}/auth/social-login`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                name: user.name,
                                email: user.email,
                                provider: account.provider,
                            }),
                        });

                        if (!res.ok) throw new Error("Failed to authenticate with backend");

                        const { data } = await res.json();
                        token.customToken = data.token;
                        token.id = data.user._id;
                    } catch (error) {
                        throw new Error(`Error during social login bridge: ${error}`);
                    }
                }

                if (user.customToken) {
                    token.customToken = user.customToken;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token.id) {
                session.user.id = token.id;
            }
            if (token.customToken) {
                session.customToken = token.customToken;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
