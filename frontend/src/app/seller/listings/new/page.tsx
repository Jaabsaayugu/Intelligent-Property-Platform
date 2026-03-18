"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePropertyFormStore } from "@/store/propertyForm.store";
import {
  propertySchema,
  PropertyFormData,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
} from "@/schemas/property.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Step1BasicInfo from "./Step1BasicInfo";
import Step2Location from "./Step2Location";
import Step3Details from "./Step3Details";
import Step4Pricing from "./Step4Pricing";
import Step5Images from "./Step5Images";
import Step6ReviewSubmit from "./Step6ReviewSubmit";

const steps = [
  { id: 1, title: "Basic Information", component: Step1BasicInfo },
  { id: 2, title: "Location", component: Step2Location },
  { id: 3, title: "Property Details", component: Step3Details },
  { id: 4, title: "Pricing", component: Step4Pricing },
  { id: 5, title: "Features", component: Step5Images },           // ← note: your original had images here
  { id: 6, title: "Review & Submit", component: Step6ReviewSubmit },
];

export default function NewPropertyPage() {
  const router = useRouter();
  const { data, step, setData, setStep, reset } = usePropertyFormStore();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      propertyType: "house" as const,
      status: "sale" as const,
      address: "",
      city: "",
      county: undefined,
      latitude: undefined,
      longitude: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      areaSqm: undefined,
      yearBuilt: undefined,
      price: 0,
      currency: "KES" as const,
      features: [],                    // ← empty array – safe & clean
      images: [],                      // ← empty array – min(1) enforced on submit
    },
    mode: "onChange",
  });

  // Sync form → store
  useEffect(() => {
    const subscription = form.watch((value) => {
      setData(value as Partial<PropertyFormData>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setData]);

  const currentStep = steps.find((s) => s.id === step);
  const isLastStep = step === steps.length;

  const handleNext = async () => {
    let currentSchema;

    switch (step) {
      case 1: currentSchema = step1Schema; break;
      case 2: currentSchema = step2Schema; break;
      case 3: currentSchema = step3Schema; break;
      case 4: currentSchema = step4Schema; break;
      case 5: currentSchema = step5Schema; break;
      case 6: currentSchema = propertySchema; break;
      default: currentSchema = propertySchema;
    }

    const isValid = await form.trigger(
      Object.keys(currentSchema.shape) as Array<keyof PropertyFormData>
    );

    if (isValid) {
      if (isLastStep) {
        const values = form.getValues();
        try {
          console.log("Submitting full property:", values);
          // → Here you would call your API / server action
          // await api.post("/api/properties", values);
          reset();
          router.push("/seller/dashboard?success=true");
        } catch (err) {
          console.error("Submit failed:", err);
          // You can add toast/notification here
        }
      } else {
        setStep(step + 1);
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            Add New Property – Step {step} of {steps.length}
          </CardTitle>
          <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent>
          {currentStep && (
  <currentStep.component 
    form={form} 
    isSubmitting={form.formState.isSubmitting}   // ← add this
  />
)}

          <div className="mt-10 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 1}
            >
              Previous
            </Button>

            <Button onClick={handleNext} disabled={form.formState.isSubmitting}>
              {isLastStep ? "Publish Property" : "Next Step"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}