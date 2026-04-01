"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { triggerFormSchema } from "../utils/validateEmail";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { triggerBackend } from "../services/api";

const HOURS_OPTIONS = [
  { value: "24", label: "Last 24 hours" },
  { value: "48", label: "Last 48 hours" },
  { value: "1680", label: "Last Week" },
  { value: "", label: "All time" },
];

export default function Sidebar() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(triggerFormSchema),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: triggerBackend,
    onSuccess: () => {
      // alert("Backend triggered successfully");
      reset();
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: () => {
      alert("Something went wrong");
    },
  });

  const onSubmit = (data: { email?: string; hours?: string }) => {
    const payload: Record<string, string> = {};
    if (data.email) payload.email = data.email;
    if (data.hours) payload.hours = data.hours;
    mutation.mutate(payload);
  };

  return (
    <div className="sticky top-8">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Get latest digests</h2>
        <p className="text-sm text-gray-500 mb-5">Run scrapers and optionally send a digest email.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time range
            </label>
            <select
                {...register("hours")}
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {HOURS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (optional)
            </label>
            <input
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
            )}
          </div>

          <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 w-full mt-1"
          >
            {mutation.isPending ? "Updating..." : "Check"}
          </button>
        </form>
      </div>
    </div>
  );
}
