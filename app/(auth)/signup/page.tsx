"use client";

import { firebaseAuth } from "@atechhub/firebase";
import { AuthForm, type AuthFormData } from "../_components/auth-form";

export default function SignUpPage() {
  const handleEmailSignUp = async (data: AuthFormData) => {
    try {
      const res = await firebaseAuth({
        action: "signup",
        email: data.email,
        password: data.password,
      });
      console.log(res);
    } catch (error) {
      console.error("Signup error:", error);

      // Handle specific Firebase errors
      if (error instanceof Error) {
        if (error.message.includes("email-already-in-use")) {
          throw new Error(
            "This email is already registered. Please sign in instead."
          );
        }
        if (error.message.includes("weak-password")) {
          throw new Error(
            "Password is too weak. Please use a stronger password."
          );
        }
        if (error.message.includes("invalid-email")) {
          throw new Error("Please enter a valid email address.");
        }
        // Re-throw the original error if it has a user-friendly message
        throw error;
      }

      throw new Error("Failed to create account. Please try again.");
    }
  };

  return (
    <AuthForm
      title="Create an account"
      description="Sign up to get started with your account"
      submitText="Sign up"
      onSubmit={handleEmailSignUp}
      showNameField={true}
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/signin"
    />
  );
}
