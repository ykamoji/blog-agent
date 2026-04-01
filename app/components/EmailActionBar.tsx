"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema } from "../utils/validateEmail";
import { useMutation } from "@tanstack/react-query";
import { triggerBackend } from "../services/api";

export default function EmailActionBar() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const mutation = useMutation({
    mutationFn: triggerBackend,
    onSuccess: () => {
      alert("Backend triggered successfully");
      reset();
    },
    onError: () => {
      alert("Something went wrong");
    },
  });

  const onSubmit = (data: { email: any; }) => {
    const payload = data.email ? { email: data.email } : {};
    mutation.mutate(payload);
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
      <input
        type="email"
        placeholder="name@example.com (optional)"
        {...register("email")}
        className="border rounded-xl px-4 py-2 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        // @ts-ignore
        onClick={handleSubmit(onSubmit)}
        disabled={mutation.isPending}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
      >
        {mutation.isPending ? "Processing..." : "Trigger Backend"}
      </button>

      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}
    </div>
  );
}