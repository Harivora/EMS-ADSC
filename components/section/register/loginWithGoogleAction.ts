"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signInWithGoogleAction() {
  const supabase = await createClient();

  const headersList = await headers();
  const origin = headersList.get("origin") || process.env.BASE_URL;
  const redirectTo = `${origin}/auth/callback?next=/onboarding`;
  console.log("Google Login RedirectTo:", redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      },
      scopes: 'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      redirectTo: redirectTo,
    },
  });

  if (data.url) {
    redirect(data.url);
  } else {
    console.error("Error during Google sign in:", error);
    return { error: "Failed to sign in with Google" };
  }
}
