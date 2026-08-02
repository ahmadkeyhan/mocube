import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { COLLECTIONS, getDb } from "@/lib/db";
import type { AdminUser } from "@/lib/models/types";

export const LOGIN_PATH = "/admin/login";
export const ADMIN_HOME = "/admin";

// Compared against when the username is unknown, so a wrong username costs the
// same time as a wrong password and cannot be used to enumerate accounts.
const DUMMY_HASH =
  "$2b$12$L1kPSEmWnGSo.dTjeX512eaaopRw4gbq81GwJpkyWYK4F1/pNn8Zy";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: LOGIN_PATH, error: LOGIN_PATH },
  providers: [
    Credentials({
      credentials: {
        username: { label: "نام کاربری", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        const username = String(credentials?.username ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!username || !password) return null;

        const db = await getDb();
        if (!db) return null;

        const user = await db
          .collection<AdminUser>(COLLECTIONS.users)
          .findOne({ username });

        const matches = await compare(
          password,
          user?.passwordHash ?? DUMMY_HASH,
        );
        if (!user || !matches) return null;

        return {
          id: user._id.toHexString(),
          name: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      if (token.role) session.user.role = token.role;
      return session;
    },
    authorized({ request, auth: session }) {
      if (request.nextUrl.pathname.startsWith(LOGIN_PATH)) return true;
      return session?.user?.role === "admin";
    },
  },
});
