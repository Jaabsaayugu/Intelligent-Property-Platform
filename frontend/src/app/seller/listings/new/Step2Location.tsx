import { Controller, UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/schemas/property.schema";

type Props = {
  form: UseFormReturn<PropertyFormData>;
  isSubmitting?: boolean;
};

export default function Step2Location({ form }: Props) {
  const errors = form.formState.errors;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <Controller
          control={form.control}
          name="address"
          render={({ field }) => (
            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Full address or street
              </label>
              <input
                {...field}
                placeholder="Muthaiga North, Off Kiambu Road"
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
              <p className="text-xs text-rose-600">
                {errors.address?.message}
              </p>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="city"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                City or town
              </label>
              <input
                {...field}
                placeholder="Nairobi"
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
              <p className="text-xs text-rose-600">
                {errors.city?.message}
              </p>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="county"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                County
              </label>
              <input
                {...field}
                value={field.value || ""}
                placeholder="Nairobi County"
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>
          )}
        />
      </div>

      <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Location note
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Buyers respond best when the address feels precise and trustworthy. A
          specific location helps your listing appear more credible before the first inquiry.
        </p>
      </div>
    </div>
  );
}
