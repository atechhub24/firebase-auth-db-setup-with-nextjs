"use client";

import { useParams } from "next/navigation";
import { PasswordChangeForm } from "./_components/password-change-form";

export default function ChangePasswordPage() {
  const params = useParams();
  const id = params.id as string;

  return <PasswordChangeForm staffId={id} />;
}
