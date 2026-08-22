"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { apiService } from "@/services/apiService";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignupResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    name: "",
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
      name: "",
      email: "",
      password: "",
      api: "",
    };

    if (!form.name.trim()) {
      newError.name = "Please enter name";
    }

    if (!form.email.trim()) {
      newError.email = "Please enter email";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newError.email =
        "Please enter a valid email";
    }

    if (!form.password.trim()) {
      newError.password =
        "Please enter password";
    } else if (form.password.length < 6) {
      newError.password =
        "Password must be at least 6 characters";
    }

    setError(newError);

    return (
      !newError.name &&
      !newError.email &&
      !newError.password
    );
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
        await apiService.post<SignupResponse>(
          "/api/auth/signup",
          {
            name: form.name,
            email: form.email,
            password: form.password,
          }
        );

      setSuccess(response.message);

      // Signup successful → signin
      setTimeout(() => {
        router.replace("/auth/signin");
      }, 1000);
    } catch (error: any) {
      setError((prev) => ({
        ...prev,
        api:
          error?.response?.data?.message ||
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-text">
          Create your account
        </h1>

        <p className="mt-2 text-sm leading-6 text-text-muted">
          Join us today and start taking control
          of your expenses.
        </p>
      </div>

      {/* API Error */}
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

      {/* Success */}
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

          {/* Name */}
          <Input
            label="Full name"
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            maxLength={40}
            required
            disabled={loading}
            onChange={handleChange}
            error={error.name}
          />

          {/* Email */}
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

          {/* Password */}
          <Input
            label="Password"
            name="password"
            placeholder="Create a password"
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
            onClickRightIcon={
              handlePasswordShow
            }
          />

          {/* Signup */}
          <Button
            onClick={handleSubmit}
            rightIcon={<ArrowRight size={19} />}
            loading={loading}
            className="mt-1 w-full"
          >
            Create Account
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

        {/* Signin */}
        <p className="text-center text-sm text-text-muted">
          Already have an account?{" "}

          <button
            type="button"
            onClick={() =>
              router.push("/auth/signin")
            }
            className="
              font-semibold
              text-primary
              hover:underline
            "
          >
            Sign In
          </button>
        </p>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-text-muted">
        By creating an account, you agree to our
        Terms & Privacy Policy.
      </p>
    </>
  );
}