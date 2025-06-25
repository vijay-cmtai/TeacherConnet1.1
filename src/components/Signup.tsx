import React, { useState,useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/app/hooks";
import { useSignupMutation, useGoogleLoginMutation } from "@/features/auth/authApiService";
import { setCredentials } from "@/features/auth/authSlice";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  School,
} from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"employer" | "college" | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  const handleSuccessfulLogin = (response) => {
    if (response.success && response.user) {
        dispatch(setCredentials({ user: response.user }));
        toast.success("Account created successfully!");
        const { role } = response.user;
        if (role === "admin") navigate("/dashboard/admin");
        else if (role === "college") navigate("/dashboard/college");
        else if (role === "employer") navigate("/dashboard/employer");
        else navigate("/");
      }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!role) {
        toast.error("Please select a role before signing up with Google.");
        return;
    }
    if (!termsAccepted) {
        toast.error("You must accept the terms and conditions to sign up.");
        return;
    }
    try {
        const response = await googleLogin({
            token: credentialResponse.credential,
            role: role,
        }).unwrap();
        handleSuccessfulLogin(response);
    } catch (err: any) {
         toast.error(err.data?.message || "Google Sign-up failed.");
    }
  };

  const handleGoogleError = () => {
      toast.error("Google Sign-up failed. Please try again.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword || !role) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!termsAccepted) {
        toast.error("You must accept the terms and conditions.");
        return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await signup({
        fullName,
        email,
        password,
        confirmPassword,
        role,
        termsAccepted
      }).unwrap();
      handleSuccessfulLogin(response);
    } catch (err: any) {
      toast.error(err.data?.message || "Signup failed. Please try again.");
    }
  };
  
  const termsLink = useMemo(() => {
    if (role === 'college') {
        return "https://teacher-job.s3.ap-south-1.amazonaws.com/agreements/Signup+Term+%26+Condition+for+School.pdf";
    }
    if (role === 'employer') {
        return "https://teacher-job.s3.ap-south-1.amazonaws.com/agreements/Signup+Term+%26+Condition+for+Teacher.pdf";
    }
    return "#";
  }, [role]);

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500 p-12 text-white">
        <div className="text-center">
          <Briefcase className="mx-auto h-16 w-16 mb-4" />
          <h1 className="text-4xl font-bold tracking-tight">
            Join Our Platform
          </h1>
          <p className="mt-4 text-lg text-indigo-200">
            Connecting talent with opportunity. Sign up to unlock a world of
            possibilities.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              Or{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                login if you already have one
              </Link>
            </p>
          </div>
          
          <div className="flex justify-center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                shape="pill"
                width="320px"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-500">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                required
                className="pl-10 h-12"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="pl-10 h-12"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="pl-10 h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="pl-10 h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <School className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
              <Select
                value={role}
                onValueChange={(value) => setRole(value as any)}
              >
                <SelectTrigger className="pl-10 h-12">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employer">Teacher / Candidate</SelectItem>
                  <SelectItem value="college">School / College</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(Boolean(checked))} />
                <label htmlFor="terms" className="text-sm font-medium leading-none">
                    I agree to the{" "}
                    <a
                        href={termsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                            if (!role) {
                                e.preventDefault();
                                toast.error("Please select a role first to view the terms.");
                            }
                        }}
                        className={`underline text-indigo-600 hover:text-indigo-500 ${!role ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        Terms and Conditions
                    </a>
                </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 hover:opacity-90 transition-opacity"
              disabled={isLoading || isGoogleLoading || !termsAccepted}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;