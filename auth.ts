import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { COLLECTIONS, getDb } from "@/lib/db";
import type { AppUser } from "@/lib/models/types";

export const LOGIN_PATH = "/admin/login";
export const ADMIN_HOME = "/admin";
export const CALENDAR_LOGIN_PATH = "/calendar/login";
export const CALENDAR_HOME = "/calendar";
export const CALENDAR_SIGNUP_PATH = "/calendar/signup";
export const CALENDAR_PENDING_PATH = "/calendar/pending";

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
          .collection<AppUser>(COLLECTIONS.users)
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
      const { pathname } = request.nextUrl;
      if (pathname === LOGIN_PATH || pathname.startsWith(CALENDAR_LOGIN_PATH)) {
        return true;
      }
      if (pathname.startsWith(CALENDAR_SIGNUP_PATH)) return true;
      if (pathname.startsWith("/calendar/share")) return true;

      if (pathname.startsWith("/admin")) {
        if (session?.user?.role === "admin") return true;
        if (session?.user) {
          return Response.redirect(new URL(CALENDAR_HOME, request.nextUrl));
        }
        return false;
      }

      if (pathname.startsWith("/calendar")) {
        if (session?.user?.role === "admin") {
          return Response.redirect(new URL(ADMIN_HOME, request.nextUrl));
        }
        if (session?.user) return true;
        return Response.redirect(new URL(CALENDAR_LOGIN_PATH, request.nextUrl));
      }

      return true;
    },
  },
});
