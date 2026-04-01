"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { triggerFormSchema } from "../utils/validateEmail";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {anthropic, digest, email, scrapper, triggerBackend, youtube} from "../services/api";
import {useState} from "react";

const HOURS_OPTIONS = [
  { value: "24", label: "Last 24 hours" },
  { value: "48", label: "Last 48 hours" },
  { value: "1680", label: "Last Week" },
  { value: "", label: "All time" },
];

const steps = [
  "scrapper",
  "anthropic",
  "youtube",
  "digest",
  "email",
] as const;

type StepStatus = "idle" | "loading" | "success" | "error";

const Spinner = () => (
  <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
);


export default function Sidebar() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(triggerFormSchema),
  });

  const [progress, setProgress] = useState<Record<string, StepStatus>>(
  steps.reduce((acc, step) => {
    acc[step] = "idle";
    return acc;
  }, {} as Record<string, StepStatus>)
);

  const [showProgress, setShowProgress] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
  mutationFn: async (payload: { email?: string; hours?: string }) => {
    const runStep = async (name: string, fn: () => Promise<any>) => {
      setProgress((prev) => ({ ...prev, [name]: "loading" }));

      try {
        await fn();
        setProgress((prev) => ({ ...prev, [name]: "success" }));
      } catch (err) {
        setProgress((prev) => ({ ...prev, [name]: "error" }));
        throw err; // important: stop pipeline
      }
    };

    await runStep("scrapper", () => scrapper(payload));
    await runStep("anthropic", () => anthropic(payload));
    await runStep("youtube", () => youtube(payload));
    await runStep("digest", () => digest(payload));
    await runStep("email", () => email(payload));
  },

  onMutate: () => {
    // reset progress on new run
    setProgress(
      steps.reduce((acc, step) => {
        acc[step] = "idle";
        return acc;
      }, {} as Record<string, StepStatus>)
    );
  },

  onSuccess: () => {
    reset();
    queryClient.invalidateQueries({ queryKey: ["articles"] });
    setTimeout(() => setShowProgress(false), 1000);
  },

  onError: () => {
    // alert("Something went wrong");
  },
});

  const onSubmit = (data: { email?: string; hours?: string }) => {
    const payload: Record<string, string> = {};
    if (data.email) payload.email = data.email;
    if (data.hours) payload.hours = data.hours;
    setShowProgress(true);
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
        <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showProgress ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"
            }`}
        >
          <div className="flex flex-col">
            {steps.map((step, index) => (
                <div key={step} className="flex items-start">

                  {/* vertical line + dot */}
                  <div className="flex flex-col items-center mt-1 w-4">
                    <div className="w-3 h-3 flex items-center justify-center">
                      {progress[step] === "loading" ? (
                          <Spinner/>
                      ) : (
                          <div
                              className={`w-3 h-3 rounded-full ${
                                  progress[step] === "success"
                                      ? "bg-green-500"
                                      : progress[step] === "error"
                                          ? "bg-red-500"
                                          : "bg-gray-300"
                              }`}
                          />
                      )}
                    </div>

                    {index < steps.length - 1 && (
                        <div className="w-px h-6 bg-gray-300"/>
                    )}
                  </div>

                  {/* label */}
                  <div className="ms-3 text-gray-700">
                    {progress[step] !== "idle" && (
                        <span className="text-sm capitalize leading-5">
            {step}
                          {progress[step] === "loading" && "..."}
                          {progress[step] === "success" && " ✓"}
                          {progress[step] === "error" && " ✕"}
          </span>
                    )}
                  </div>

                </div>
            ))}
          </div>
        </div>
      </div>
        );
        }
