"use client";

import { useParams } from "next/navigation";

export default function StaffDetailsPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Staff Details</h1>
      <p className="text-gray-600">Viewing staff with ID: {id}</p>
    </div>
  );
}
