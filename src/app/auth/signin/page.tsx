"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { apiService } from "@/services/apiService";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SigninResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}
export default function SigninPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
    api: "",
  });

  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: "",
      api: "",
    }));

    setSuccess("");
  };

  const verifyForm = () => {
    const newError = {
      email: "",
      password: "",
      api: "",
    };

    if (!form.email.trim()) {
      newError.email = "Please enter email";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newError.email = "Please enter a valid email";
    }

    if (!form.password.trim()) {
      newError.password = "Please enter password";
    } else if (form.password.length < 6) {
      newError.password =
        "Password must be at least 6 characters";
    }

    setError(newError);

    return !newError.email && !newError.password;
  };

  const handleSubmit = async () => {
    setSuccess("");

    setError((prev) => ({
      ...prev,
      api: "",
    }));

    const isValid = verifyForm();

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const response =
        await apiService.post<SigninResponse>(
          "/api/auth/signin",
          {
            email: form.email,
            password: form.password,
          }
        );

      localStorage.setItem(
        "accessToken",
        response.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        response.refreshToken
      );

      setSuccess(response.message);

      router.replace("/finance");
    } catch (error: any) {
      setError((prev) => ({
        ...prev,
        api:
          error?.response?.data?.error ||
          "Something went wrong. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordShow = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-text">
          Welcome back
        </h1>

        <p className="mt-2 text-sm leading-6 text-text-muted">
          Sign in to your account and continue managing
          your expenses.
        </p>
      </div>
      {error.api && (
        <div
          className="
            mb-5
            rounded-xl
            border border-red-200
            bg-red-50
            px-4 py-3
            text-sm text-red-600
          "
        >
          {error.api}
        </div>
      )}
      {success && (
        <div
          className="
            mb-5
            rounded-xl
            border border-green-200
            bg-green-50
            px-4 py-3
            text-sm text-green-600
          "
        >
          {success}
        </div>
      )}

      {/* Form Card */}
      <div
        className="
          rounded-2xl
          border border-border
          bg-surface
          p-6
          shadow-sm
          sm:p-7
        "
      >
        <div className="grid gap-5">

          <Input
            label="Email address"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            maxLength={40}
            required
            disabled={loading}
            onChange={handleChange}
            error={error.email}
          />

          <div>
            <Input
              label="Password"
              name="password"
              placeholder="Enter your password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              required
              maxLength={20}
              value={form.password}
              disabled={loading}
              onChange={handleChange}
              error={error.password}
              rightIcon={
                showPassword ? (
                  <Eye size={19} />
                ) : (
                  <EyeClosed size={19} />
                )
              }
              onClickRightIcon={handlePasswordShow}
            />

            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/auth/forgot-password"
                  )
                }
                className="
                  text-sm
                  font-medium
                  text-primary
                  hover:underline
                "
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            rightIcon={<ArrowRight size={19} />}
            loading={loading}
            className="mt-1 w-full"
          >
            Sign In
          </Button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />

          <span className="text-xs text-text-muted">
            OR
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Signup */}
        <p className="text-center text-sm text-text-muted">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={() =>
              router.push("/auth/signup")
            }
            className="
              font-semibold
              text-primary
              hover:underline
            "
          >
            Create account
          </button>
        </p>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-text-muted">
        By continuing, you agree to our Terms &
        Privacy Policy.
      </p>
    </>
  );
}