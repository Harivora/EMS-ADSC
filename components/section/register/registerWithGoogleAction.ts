"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function registerWithGoogleAction() {
  const supabase = await createClient();

  const headersList = await headers();
  const origin = headersList.get("origin") || process.env.BASE_URL;

  // Force production URL if not in development
  const isDev = process.env.NODE_ENV === "development";
  const finalOrigin = isDev ? origin : "https://adsc-atmiya.vercel.app";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: { access_type: 'offline', prompt: 'consent' },
      scopes:
        'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      redirectTo: `${finalOrigin}/auth/callback?next=/onboarding`,
    },
  });

  if (data.url) {
    redirect(data.url);
  } else {
    console.error("Error during Google sign-in:", error);
    return { error: "Failed to sign in with Google" };
  }
}
