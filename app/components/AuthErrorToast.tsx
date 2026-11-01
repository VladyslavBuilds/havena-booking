'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

// When an OAuth sign-in fails, NextAuth redirects to the sign-in page
// (our home page) with ?error=<code> and nothing else happens, so the
// person is left wondering. This turns the code into a toast and removes
// it from the address bar.
const MESSAGES: Record<string, string> = {
    OAuthAccountNotLinked:
        "An account with this e-mail already exists. Log in the way you signed up first (e-mail & password or the other provider).",
    OAuthSignin: "Could not start the sign-in with that provider. Please try again.",
    OAuthCallback: "The provider did not complete the sign-in. Please try again.",
    OAuthCreateAccount: "Could not create an account with that provider.",
    AccessDenied: "Access denied.",
    Callback: "Sign-in failed. Please try again.",
    Default: "Something went wrong while signing in.",
};

const AuthErrorToast = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const error = searchParams?.get("error") ?? null;

    useEffect(() => {
        if (!error || !searchParams) {
            return;
        }

        // A fixed id means the same error is never shown twice
        toast.error(MESSAGES[error] ?? MESSAGES.Default, { id: "auth-error" });

        const params = new URLSearchParams(searchParams.toString());
        params.delete("error");
        const query = params.toString();
        const path = pathname ?? "/";
        router.replace(query ? `${path}?${query}` : path);
    }, [error, searchParams, pathname, router]);

    return null;
};

export default AuthErrorToast;
