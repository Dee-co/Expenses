"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { apiService } from "@/services/apiService";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeClosed,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
type Step = 1 | 2 | 3;
interface ApiResponse {
  message: string;
  verified?: boolean;
  resetToken?: string;
  expiresAt?: string;
}
export default function ForgetPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Resend cooldown
  const [resendTimer, setResendTimer] = useState(0); // OTP expires in 10 minutes
  const OTP_DURATION = 10 * 60;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);
  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  const handleSendOtp = async () => {
    if (!form.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.post<ApiResponse>("/api/auth/sendOtp", {
        email: form.email.trim().toLowerCase(),
      });
      toast.success(response.message || "OTP sent successfully");
      setForm((prev) => ({
        ...prev,
        otp: "",
      })); // 60 sec resend cooldown
      setResendTimer(60);
      setStep(2);
    } catch (error: any) {
      console.log("Send OTP error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async () => {
    if (!form.otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }
    if (form.otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.post<ApiResponse>(
        "/api/auth/verifyOtp",
        {
          email: form.email.trim().toLowerCase(),
          otp: form.otp,
        },
      );
      if (!response.resetToken) {
        toast.error("Reset token not received");
        return;
      }
      setResetToken(response.resetToken);
      toast.success(response.message || "OTP verified successfully");
      setStep(3);
    } catch (error: any) {
      console.log("Verify OTP error:", error);
      toast.error(
        error?.response?.data?.message || "Invalid OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleResendOtp = async () => {
    if (resendTimer > 0) {
      toast.info(
        `Please wait ${formatTimer(resendTimer)} before resending OTP`,
      );
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.post<ApiResponse>("/api/auth/sendOtp", {
        email: form.email.trim().toLowerCase(),
      });
      toast.success(response.message || "New OTP sent successfully");
      setForm((prev) => ({
        ...prev,
        otp: "",
      })); // Start 60 sec resend cooldown
      setResendTimer(60);
    } catch (error: any) {
      console.log("Resend OTP error:", error);
      toast.error(error?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async () => {
    if (!form.newPassword.trim()) {
      toast.error("Please enter new password");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!form.confirmPassword.trim()) {
      toast.error("Please confirm your password");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!resetToken) {
      toast.error("Reset session expired. Please start again.");
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.post<ApiResponse>(
        "/api/auth/resetPassword",
        {
          reset_token: resetToken,
          newPassword: form.newPassword,
        },
      );
      toast.success(response.message || "Password updated successfully");
      setResetToken("");
      setForm({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1500);
    } catch (error: any) {
      console.log("Reset password error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update password.",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    if (step === 2) {
      setForm((prev) => ({
        ...prev,
        otp: "",
      }));
      setResendTimer(0);
      setStep(1);
    }
    if (step === 3) {
      setForm((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
      setResetToken("");
      setStep(2);
    }
  };
  return (
    <div
      className="
        w-full max-w-md
      "
    >
      <div
        className="
          mb-8
        "
      >
        <div
          className="
            flex
            h-12 w-12
            mb-5
            text-primary
            bg-primary/10
            rounded-xl
            items-center justify-center
          "
        >
          {step === 1 && <Mail size={22} />}
          {step === 2 && <ShieldCheck size={22} />}
          {step === 3 && <LockKeyhole size={22} />}
        </div>
        <h1
          className="
            text-3xl font-bold tracking-tight text-text
          "
        >
          {step === 1 && "Forgot your password?"}
          {step === 2 && "Verify your OTP"}
          {step === 3 && "Create new password"}
        </h1>
        <p
          className="
            mt-2
            text-sm leading-6 text-text-muted
          "
        >
          {step === 1 &&
            "Enter your email address and we'll send you a verification code."}
          {step === 2 && `Enter the 6-digit code sent to ${form.email}.`}
          {step === 3 && "Create a new password to secure your account."}
        </p>
      </div>
      <div
        className="
          flex
          mb-6
          items-center
        "
      >
        <div
          className={`
            flex
            h-9 w-9
            text-sm font-semibold
            rounded-full
            shrink-0 items-center justify-center
            ${step >= 1 ? "bg-primary text-white" : "bg-border text-text-muted"}
          `}
        >
          {step > 1 ? <CheckCircle2 size={18} /> : "1"}
        </div>
        <div
          className={`
            flex-1
            h-0.5
            mx-2
            ${step >= 2 ? "bg-primary" : "bg-border"}
          `}
        />
        <div
          className={`
            flex
            h-9 w-9
            text-sm font-semibold
            rounded-full
            shrink-0 items-center justify-center
            ${step >= 2 ? "bg-primary text-white" : "bg-border text-text-muted"}
          `}
        >
          {step > 2 ? <CheckCircle2 size={18} /> : "2"}
        </div>
        <div
          className={`
            flex-1
            h-0.5
            mx-2
            ${step >= 3 ? "bg-primary" : "bg-border"}
          `}
        />
        <div
          className={`
            flex
            h-9 w-9
            text-sm font-semibold
            rounded-full
            shrink-0 items-center justify-center
            ${step >= 3 ? "bg-primary text-white" : "bg-border text-text-muted"}
          `}
        >
          3
        </div>
      </div>
      <div
        className="
          p-6
          bg-surface
          rounded-2xl border border-border
          shadow-sm
          sm:p-7
        "
      >
        {step === 1 && (
          <div
            className="
              grid
              gap-5
            "
          >
            <Input
              label="Email address"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              maxLength={40}
              required
              disabled={loading}
              onChange={handleChange}
              leftIcon={<Mail size={19} />}
            />
            <Button
              onClick={handleSendOtp}
              rightIcon={<ArrowRight size={19} />}
              loading={loading}
              className="
                w-full
                mt-1
              "
            >
              Send OTP
            </Button>
          </div>
        )}
        {step === 2 && (
          <div
            className="
              grid
              gap-5
            "
          >
            <Input
              label="Verification code"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={form.otp}
              onlyDigits
              maxLength={6}
              required
              disabled={loading}
              onChange={handleChange}
              leftIcon={<ShieldCheck size={19} />}
            />
            <div
              className="
                px-3 py-2
                text-center text-xs text-text-muted
                bg-primary/5
                rounded-lg
              "
            >
              OTP is valid for <b>10 minutes</b>.
            </div>
            <div
              className="
                text-center
              "
            >
              <p
                className="
                  text-sm text-text-muted
                "
              >
                Didn't receive the OTP?
              </p>
              {resendTimer > 0 ? (
                <p
                  className="
                    mt-1
                    text-sm text-text-muted
                  "
                >
                  Resend OTP in
                  <span
                    className="
                      font-semibold text-primary
                    "
                  >
                    {formatTimer(resendTimer)}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleResendOtp}
                  className="
                    mt-1
                    text-sm font-semibold text-primary
                    hover:underline disabled:cursor-not-allowed disabled:opacity-50
                  "
                >
                  Resend OTP
                </button>
              )}
            </div>
            <Button
              onClick={handleVerifyOtp}
              rightIcon={<ArrowRight size={19} />}
              loading={loading}
              className="
                w-full
              "
            >
              Verify OTP
            </Button>
            <button
              type="button"
              disabled={loading}
              onClick={handleBack}
              className="
                flex
                text-sm font-medium text-text-muted
                items-center justify-center gap-2 hover:text-primary disabled:opacity-50
              "
            >
              <ArrowLeft size={17} />
              Change email
            </button>
          </div>
        )}
        {step === 3 && (
          <div
            className="
              grid
              gap-5
            "
          >
            <Input
              label="New password"
              name="newPassword"
              placeholder="Enter new password"
              type={showPassword ? "text" : "password"}
              value={form.newPassword}
              maxLength={20}
              required
              disabled={loading}
              onChange={handleChange}
              leftIcon={<LockKeyhole size={19} />}
              rightIcon={
                showPassword ? <Eye size={19} /> : <EyeClosed size={19} />
              }
              onClickRightIcon={() => setShowPassword((prev) => !prev)}
            />
            <Input
              label="Confirm password"
              name="confirmPassword"
              placeholder="Confirm new password"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              maxLength={20}
              required
              disabled={loading}
              onChange={handleChange}
              leftIcon={<LockKeyhole size={19} />}
              rightIcon={
                showConfirmPassword ? (
                  <Eye size={19} />
                ) : (
                  <EyeClosed size={19} />
                )
              }
              onClickRightIcon={() => setShowConfirmPassword((prev) => !prev)}
            />
            <Button
              onClick={handleResetPassword}
              rightIcon={<CheckCircle2 size={19} />}
              loading={loading}
              className="
                w-full
                mt-1
              "
            >
              Update Password
            </Button>
            <button
              type="button"
              disabled={loading}
              onClick={handleBack}
              className="
                flex
                text-sm font-medium text-text-muted
                items-center justify-center gap-2 hover:text-primary disabled:opacity-50
              "
            >
              <ArrowLeft size={17} />
              Back to OTP
            </button>
          </div>
        )}
      </div>
      <p
        className="
          mt-6
          text-center text-xs text-text-muted
        "
      >
        Your password reset session is secure and time-limited.
      </p>
    </div>
  );
}
