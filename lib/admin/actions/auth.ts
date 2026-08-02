"use server";

import { AuthError } from "next-auth";
import { ADMIN_HOME, LOGIN_PATH, signIn, signOut } from "@/auth";
import type { FormState } from "@/lib/admin/validation";

export async function loginAction(
  _prevState: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { message: "نام کاربری و رمز عبور را وارد کنید." };
  }

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: ADMIN_HOME,
    });
    return {};
  } catch (error) {
    // signIn signals a successful login by throwing a redirect, which must bubble up.
    if (error instanceof AuthError) {
      return { message: "نام کاربری یا رمز عبور نادرست است." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: LOGIN_PATH });
}
