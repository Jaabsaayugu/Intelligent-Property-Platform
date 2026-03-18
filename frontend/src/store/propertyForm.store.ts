import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PropertyFormData } from "@/schemas/property.schema";

type PropertyFormState = {
  data: Partial<PropertyFormData>;
  step: number;
  setData: (data: Partial<PropertyFormData>) => void;
  setStep: (step: number) => void;
  reset: () => void;
};

export const usePropertyFormStore = create<PropertyFormState>()(
  persist(
    (set) => ({
      data: {},
      step: 1,
      setData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
      setStep: (step) => set({ step }),
      reset: () => set({ data: {}, step: 1 }),
    }),
    {
      name: "property-form-storage", // persists in localStorage
    }
  )
);