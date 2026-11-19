import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const expectedUser = process.env.ADMIN_USERNAME || "admin";
        const expectedPass = process.env.ADMIN_PASSWORD || "admin_password_123";

        if (
          credentials?.username?.trim() === expectedUser.trim() &&
          credentials?.password === expectedPass
        ) {
          return { id: "admin-1", name: "Quản Trị Viên", email: "admin@gpstudio99.com", role: "admin" } as any;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
