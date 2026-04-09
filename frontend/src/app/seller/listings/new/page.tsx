"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePropertyFormStore } from "@/store/propertyForm.store";
import api from "@/lib/axios";
import {
  propertySchema,
  PropertyFormData,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
} from "@/schemas/property.schema";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2Location from "./Step2Location";
import Step3Details from "./Step3Details";
import Step4Pricing from "./Step4Pricing";
import Step5Images from "./Step5Images";
import Step6ReviewSubmit from "./Step6ReviewSubmit";

const steps = [
  {
    id: 1,
    title: "Basic Information",
    eyebrow: "Step 1",
    description: "Set the tone with a compelling title, property type, and listing purpose.",
    component: Step1BasicInfo,
  },
  {
    id: 2,
    title: "Location",
    eyebrow: "Step 2",
    description: "Add a precise address so buyers can understand the neighborhood instantly.",
    component: Step2Location,
  },
  {
    id: 3,
    title: "Property Details",
    eyebrow: "Step 3",
    description: "Capture the details that shape value and buyer confidence.",
    component: Step3Details,
  },
  {
    id: 4,
    title: "Pricing",
    eyebrow: "Step 4",
    description: "Frame the listing with clear pricing and the right commercial context.",
    component: Step4Pricing,
  },
  {
    id: 5,
    title: "Images",
    eyebrow: "Step 5",
    description: "Add visuals that make the property feel credible, premium, and market-ready.",
    component: Step5Images,
  },
  {
    id: 6,
    title: "Review & Submit",
    eyebrow: "Step 6",
    description: "Check the final presentation before publishing the listing to your dashboard.",
    component: Step6ReviewSubmit,
  },
] as const;

const sellerTips = [
  "Lead with clear, natural language instead of generic sales phrases.",
  "Strong visuals and accurate location details increase buyer trust fastest.",
  "Treat the review step like your final storefront before publication.",
];

export default function NewPropertyPage() {
  const router = useRouter();
  const { step, setData, setStep, reset } = usePropertyFormStore();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      propertyType: "house",
      status: "sale",
      address: "",
      city: "",
      county: undefined,
      subCounty: "",
      ward: "",
      area: "",
      exactLocation: "",
      latitude: undefined,
      longitude: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      areaSqm: undefined,
      yearBuilt: undefined,
      price: 0,
      currency: "KES",
      features: [],
      images: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setData(value as Partial<PropertyFormData>);
    });
    return () => subscription.unsubscribe();
  }, [form, setData]);

  const currentStep = steps.find((item) => item.id === step) || steps[0];
  const CurrentStepComponent = currentStep.component;
  const isLastStep = step === steps.length;

  const handleNext = async () => {
    let currentSchema;
    let fieldsToValidate: Array<keyof PropertyFormData> = [];

    switch (step) {
      case 1:
        currentSchema = step1Schema;
        fieldsToValidate = ["title", "description", "propertyType", "status"];
        break;
      case 2:
        currentSchema = step2Schema;
        fieldsToValidate = [
          "address",
          "city",
          "county",
          "subCounty",
          "ward",
          "area",
          "exactLocation",
          "latitude",
          "longitude",
        ];
        break;
      case 3:
        currentSchema = step3Schema;
        fieldsToValidate = ["bedrooms", "bathrooms", "areaSqm", "yearBuilt"];
        break;
      case 4:
        currentSchema = step4Schema;
        fieldsToValidate = ["price", "currency"];
        break;
      case 5:
        currentSchema = step5Schema;
        fieldsToValidate = ["images"];
        break;
      case 6:
        currentSchema = propertySchema;
        fieldsToValidate = [
          "title",
          "description",
          "propertyType",
          "status",
          "address",
          "city",
          "county",
          "subCounty",
          "ward",
          "area",
          "exactLocation",
          "latitude",
          "longitude",
          "bedrooms",
          "bathrooms",
          "areaSqm",
          "yearBuilt",
          "price",
          "currency",
          "features",
          "images",
        ];
        break;
      default:
        currentSchema = propertySchema;
        fieldsToValidate = [
          "title",
          "description",
          "propertyType",
          "status",
          "address",
          "city",
          "county",
          "subCounty",
          "ward",
          "area",
          "exactLocation",
          "latitude",
          "longitude",
          "bedrooms",
          "bathrooms",
          "areaSqm",
          "yearBuilt",
          "price",
          "currency",
          "features",
          "images",
        ];
    }

    const values = form.getValues();
    const stepValues = Object.fromEntries(
      fieldsToValidate.map((field) => [field, values[field]])
    );
    const validation = currentSchema.safeParse(stepValues);

    form.clearErrors(fieldsToValidate);

    if (!validation.success) {
      const firstIssue = validation.error.issues[0];

      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0];
        if (typeof fieldName === "string") {
          form.setError(fieldName as keyof PropertyFormData, {
            type: "manual",
            message: issue.message,
          });
        }
      }

      if (firstIssue && typeof firstIssue.path[0] === "string") {
        form.setFocus(firstIssue.path[0] as keyof PropertyFormData);
      }
      return;
    }

    if (isLastStep) {
      try {
        const {
          subCounty: _subCounty,
          ward: _ward,
          area: _area,
          exactLocation: _exactLocation,
          ...payload
        } = values;
        await api.post("/properties", payload);
        reset();
        router.push("/seller/dashboard?success=true");
      } catch (err) {
        console.error("Submit failed:", err);
      }
      return;
    }

    setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div className="absolute inset-0 soft-grid opacity-35" />
      <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="absolute right-[8%] top-10 h-64 w-64 rounded-full bg-amber-200/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <header className="hero-panel rounded-[2rem] border border-white/60 px-6 py-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)] sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-800/70">
                Seller Listing Studio
              </p>
              <h1 className="mt-4 font-display text-4xl leading-none text-slate-900 sm:text-5xl">
                Build a listing
                <span className="block text-teal-700">that feels premium before it even goes live.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                This guided flow helps you shape a property page with stronger
                clarity, cleaner structure, and a more confident market presentation.
              </p>
            </div>

            <button
              onClick={() => router.push("/seller/dashboard")}
              className="rounded-full border border-slate-900/10 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
            >
              Back to dashboard
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="space-y-6">
            <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
                Progress
              </p>
              <h2 className="mt-3 font-display text-3xl text-slate-900">
                Step {step} of {steps.length}
              </h2>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0f2747] via-[#17365d] to-[#4d6f96] transition-all duration-300"
                  style={{ width: `${(step / steps.length) * 100}%` }}
                />
              </div>

              <div className="mt-8 space-y-3">
                {steps.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-[1.5rem] border px-4 py-4 transition ${
                      item.id === step
                        ? "border-[#0f2747] bg-[#e8eef8] shadow-[0_12px_30px_-20px_rgba(15,39,71,0.75)]"
                        : item.id < step
                        ? "border-emerald-200 bg-emerald-50/70"
                        : "border-slate-200/80 bg-white/75"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      {item.eyebrow}
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_28px_80px_-45px_rgba(15,23,42,0.8)] sm:p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">
                Seller notes
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                Small details change how serious your listing feels.
              </h2>
              <div className="mt-6 space-y-3">
                {sellerTips.map((tip) => (
                  <div
                    key={tip}
                    className="rounded-3xl bg-white/10 px-4 py-3 text-sm leading-6 text-white/80"
                  >
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
                  {currentStep.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-3xl text-slate-900">
                  {currentStep.title}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-600">
                {currentStep.description}
              </p>
            </div>

            <div className="mt-8 rounded-[1.75rem] bg-white/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-6">
              <CurrentStepComponent
                form={form}
                isSubmitting={form.formState.isSubmitting}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1}
                className="rounded-full border border-slate-900/10 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous step
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={form.formState.isSubmitting}
                className="rounded-full bg-[#0f2747] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0b1d35] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLastStep ? "Publish property" : "Continue"}
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
