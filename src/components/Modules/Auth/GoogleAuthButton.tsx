"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

type GoogleAuthButtonProps = {
  label: string;
  loadingLabel: string;
  onToken: (token: string) => Promise<void>;
  className?: string;
  disabled?: boolean;
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 shrink-0">
      <path fill="#EA4335" d="M12 10.2v3.95h5.59c-.24 1.28-1 2.37-2.12 3.1v2.58h3.42c2-1.84 3.16-4.55 3.16-7.76 0-.75-.07-1.47-.2-2.17H12Z" />
      <path fill="#4285F4" d="M12 22c2.7 0 4.96-.9 6.61-2.44l-3.42-2.58c-.95.64-2.17 1.02-3.19 1.02-2.45 0-4.53-1.65-5.27-3.87H3.18v2.68A9.98 9.98 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.73 14.13a5.97 5.97 0 0 1 0-4.26V7.19H3.18a9.99 9.99 0 0 0 0 8.95l3.55-2.01Z" />
      <path fill="#34A853" d="M12 5.97c1.47 0 2.77.5 3.82 1.49l2.86-2.86C16.95 2.95 14.69 2 12 2a9.98 9.98 0 0 0-8.82 5.19l3.55 2.68C7.47 7.23 9.55 5.97 12 5.97Z" />
    </svg>
  );
}

export function GoogleAuthButton({
  label,
  loadingLabel,
  onToken,
  className,
  disabled,
}: GoogleAuthButtonProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isExchanging, setIsExchanging] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;

    setIsOpening(false);

    if (!token) {
      toast.error("Google did not return an identity token.");
      return;
    }

    setIsExchanging(true);

    try {
      await onToken(token);
    } catch {
      // The caller handles the surfaced error message.
    } finally {
      setIsExchanging(false);
    }
  };

  const handleError = () => {
    setIsOpening(false);
    setIsExchanging(false);
    toast.error("Google sign-in was cancelled.");
  };
  const isBusy = isOpening || isExchanging;

  return (
    <div className={cn("w-full", className)}>
      {googleClientId ? (
        <div className="google-signin-wrapper w-full overflow-hidden rounded-xl border-2 border-zinc-800 bg-white shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_10px_30px_-18px_rgba(0,0,0,0.75)]">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            theme="outline"
            shape="rectangular"
            text="continue_with"
            width={400}
          />
        </div>
      ) : (
        <button
          type="button"
          disabled
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border-2 border-zinc-800 bg-white px-4 text-sm font-semibold text-zinc-950 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_10px_30px_-18px_rgba(0,0,0,0.75)] opacity-60"
          title="Google sign-in is not configured"
        >
          <GoogleMark />
          <span>{label}</span>
        </button>
      )}

      {(isBusy || disabled) && googleClientId ? (
        <div className="pointer-events-none -mt-12 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-zinc-950/70 text-sm font-semibold text-zinc-50">
          <Loader2 className="size-4 animate-spin" />
          <span>{isBusy ? loadingLabel : label}</span>
        </div>
      ) : null}
    </div>
  );
}