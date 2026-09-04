import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/lib/models/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

// next-auth/jwt only re-exports @auth/core/jwt, so the interface must be
// augmented at its source for the merge to take effect.
declare module "@auth/core/jwt" {
  interface JWT {
    role?: UserRole;
  }
}
