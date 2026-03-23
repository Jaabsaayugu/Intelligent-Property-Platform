import { Controller, UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/schemas/property.schema";

type Props = {
  form: UseFormReturn<PropertyFormData>;
  isSubmitting?: boolean;
};

export default function Step3Details({ form }: Props) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Controller
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Bedrooms
              </label>
              <input
                type="number"
                min={0}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="4"
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Bathrooms
              </label>
              <input
                type="number"
                min={0}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="3"
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="areaSqm"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Area in square meters
              </label>
              <input
                type="number"
                min={0}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="240"
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="yearBuilt"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Year built
              </label>
              <input
                type="number"
                min={1900}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="2021"
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>
          )}
        />
      </div>

      <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Why this matters
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Good structural details reduce low-intent questions and help serious
          buyers compare your listing more quickly.
        </p>
      </div>
    </div>
  );
}
