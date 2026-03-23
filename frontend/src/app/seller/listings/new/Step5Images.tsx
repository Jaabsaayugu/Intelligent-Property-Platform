import { Controller, UseFormReturn } from "react-hook-form";
import { X } from "lucide-react";
import { PropertyFormData } from "@/schemas/property.schema";

type Props = {
  form: UseFormReturn<PropertyFormData>;
  isSubmitting?: boolean;
};

export default function Step5Images({ form }: Props) {
  const images = form.watch("images") || [];

  const addImage = () => {
    const current = form.getValues("images") || [];
    form.setValue("images", [...current, ""], { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    const current = form.getValues("images") || [];
    form.setValue(
      "images",
      current.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Visual guidance
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Add direct image URLs for now. Aim for bright, sharp images that show
          the front, living areas, bedrooms, bathrooms, and any standout exterior views.
        </p>
      </div>

      <div className="space-y-4">
        {images.length === 0 && (
          <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-5 text-sm leading-7 text-slate-600">
            No image URLs added yet. Start with your strongest cover image first.
          </div>
        )}

        {images.map((_, index) => (
          <Controller
            key={index}
            control={form.control}
            name={`images.${index}`}
            render={({ field }) => (
              <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Image URL {index + 1}
                  </label>
                  <input
                    {...field}
                    placeholder="https://example.com/property-image.jpg"
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                  />
                  <p className="mt-2 text-xs text-rose-600">
                    {form.formState.errors.images?.[index]?.message as string}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addImage}
        className="rounded-full border border-slate-900/10 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Add image URL
      </button>
    </div>
  );
}
