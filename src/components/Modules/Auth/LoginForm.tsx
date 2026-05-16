"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/UI/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/form";
import { Input } from "@/components/UI/input";
import { GoogleAuthButton } from "@/components/Modules/Auth/GoogleAuthButton";
import { useGoogleLoginMutation, useLoginMutation } from "@/redux/api/authApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { getApiErrorMessage } from "@/utils/error";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await login(values).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        })
      );

      toast.success("Login successful");
      router.push(redirectTo);
    } catch (error) {
      const message = getApiErrorMessage(error);
      form.setError("root", { message });
      toast.error(message);
    }
  };

  const handleGoogleToken = async (token: string) => {
    try {
      const result = await googleLogin({ token }).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        })
      );

      toast.success("Logged in with Google");
      router.push(redirectTo);
    } catch (error) {
      const message = getApiErrorMessage(error);
      form.setError("root", { message });
      toast.error(message);
      throw error;
    }
  };

  return (
    <Card className="w-full border-2 border-zinc-800 bg-zinc-950/92 text-zinc-50 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <CardHeader className="space-y-3 border-b border-white/6 px-6 pb-6 pt-6 sm:px-8">
        <div className="inline-flex w-fit items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-emerald-300">
          Secure sign-in
        </div>
        <CardTitle className="text-3xl text-white">Welcome back</CardTitle>
        <CardDescription className="max-w-md text-zinc-400">
          Sign in to manage trades, tokens, and your live learning dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-6 sm:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <GoogleAuthButton
              label="Continue with Google"
              loadingLabel="Connecting with Google"
              onToken={handleGoogleToken}
            />

            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-zinc-500">
              <span className="h-px flex-1 bg-white/10" />
              <span>or continue with email</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="h-12 rounded-xl border-2 border-zinc-800 bg-zinc-900/80 px-4 text-zinc-50 placeholder:text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus-visible:border-zinc-500 focus-visible:ring-4 focus-visible:ring-cyan-400/10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="h-12 rounded-xl border-2 border-zinc-800 bg-zinc-900/80 px-4 pr-12 text-zinc-50 placeholder:text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus-visible:border-zinc-500 focus-visible:ring-4 focus-visible:ring-cyan-400/10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 border border-zinc-700 bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root?.message ? (
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-200">
                {form.formState.errors.root.message}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl border-2 border-cyan-300/20 bg-cyan-300 text-zinc-950 shadow-[0_12px_30px_-18px_rgba(34,211,238,0.8)] hover:bg-cyan-200 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

          <p className="mt-6 text-center text-sm text-zinc-400">
          New to Knowledge Trader?{" "}
          <Link
            href="/register"
              className="font-medium text-cyan-300 underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
