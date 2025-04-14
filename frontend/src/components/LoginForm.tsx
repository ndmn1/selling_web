"use client";
import { useState } from "react";
import SocialLogin from "./SocialLogin";
import {  useRouter } from "next/navigation";
import { providerMap } from "@/auth.config";
import { login } from "@/actions/login";
import { LoginSchema } from "@/schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const LoginForm = ({
  isIntercept = false,
}: {
  isIntercept?: boolean;
}) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();
  const [success, setSuccess] = useState<string | undefined>("");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setSuccess(undefined);
    try {
      const data = await login(values, callbackUrl);
      if (data?.success) {
        reset();
        setSuccess(data.success);
      } else if (data?.redirect) {
        router.replace(data.redirect);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("root", { message: err.message });
      }
    }
  };

  const handleLinkClick = (targetUrl : string) => {
    if (isIntercept) {
      router.replace(targetUrl);
    } else {
      router.push(targetUrl);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md flex flex-col gap-4 "
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            id="email"
            className="p-2 border rounded-md"
            {...register("email")}
            type="text"
            placeholder="Type your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-medium">
            Password
          </label>
          <input
            id="password"
            className="p-2 border rounded-md"
            {...register("password")}
            type="password"
            placeholder="Type your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <Link href="#" className="text-sm text-slate-500 hover:underline">
            Forgot password?
          </Link>
          <button type="button" onClick= {() => handleLinkClick("/register")} className="text-sm text-slate-500 hover:underline"  >
            Create an account
          </button>
        </div>
        <button
          disabled={isSubmitting}
          className="w-full bg-slate-500 py-2 rounded-md text-white hover:bg-slate-600 transition"
        >
          {!isSubmitting ? "Sign In" : "Loading..."}
        </button>
        {errors.root && (
          <p className="text-red-500 text-sm text-center">
            {errors.root.message}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )}
      </form>
      <div className="w-full max-w-md flex flex-col gap-4">
        {Object.values(providerMap).map((provider) => (
          <SocialLogin
            key={provider.id}
            name={provider.name}
            id={provider.id}
          />
        ))}
      </div>
    </div>
  );
};

export default LoginForm;
