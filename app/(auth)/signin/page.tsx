"use client";

import { firebaseAuth } from "@atechhub/firebase";
import { AuthForm, type AuthFormData } from "../_components/auth-form";
export default function SignInPage() {
  const handleEmailSignIn = async (data: AuthFormData) => {
    try {
      const res = await firebaseAuth({
        action: "login",
        email: data.email,
        password: data.password,
      });
      console.log(res);
    } catch (error) {
      console.error("Signin error:", error);

      // Handle specific Firebase errors
      if (error instanceof Error) {
        if (
          error.message.includes("user-not-found") ||
          error.message.includes("invalid-credential")
        ) {
          throw new Error(
            "Invalid email or password. Please check your credentials.",
          );
        }
        if (error.message.includes("too-many-requests")) {
          throw new Error("Too many failed attempts. Please try again later.");
        }
        if (error.message.includes("user-disabled")) {
          throw new Error(
            "This account has been disabled. Please contact support.",
          );
        }
        // Re-throw the original error if it has a user-friendly message
        throw error;
      }

      throw new Error("Failed to sign in. Please check your credentials.");
    }
  };

  return (
    <AuthForm
      title="Welcome back"
      description="Sign in to your account to continue"
      submitText="Sign in"
      onSubmit={handleEmailSignIn}
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/signup"
    />
  );
}
