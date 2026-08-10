import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/**
 * Auth strategy: single hardcoded admin account, credentials stored in env
 * vars (password kept as a bcrypt hash, never plaintext). This satisfies the
 * brief's "may be implemented using dummy credentials" allowance while still
 * being handled securely. It's intentionally simple to reason about and to
 * explain in interview; swapping this for a DB-backed multi-admin `Admin`
 * collection later would only mean changing the `authorize` function below.
 */
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error("Admin credentials are not configured on the server.");
        }

        if (credentials.email.toLowerCase() !== adminEmail.toLowerCase()) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          adminPasswordHash
        );

        if (!isValid) {
          return null;
        }

        return { id: "admin", email: adminEmail, name: "Admin" };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
