import type { DefaultSession } from "next-auth";
import type { AdminRole } from "@/lib/models/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AdminRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: AdminRole;
  }
}

// next-auth/jwt only re-exports @auth/core/jwt, so the interface must be
// augmented at its source for the merge to take effect.
declare module "@auth/core/jwt" {
  interface JWT {
    role?: AdminRole;
  }
}
