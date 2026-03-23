import { Controller, UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/schemas/property.schema";

type Props = {
  form: UseFormReturn<PropertyFormData>;
  isSubmitting?: boolean;
};

export default function Step4Pricing({ form }: Props) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Controller
          control={form.control}
          name="price"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Listing price
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
                placeholder="12500000"
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="currency"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Currency
              </label>
              <select
                {...field}
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              >
                <option value="KES">KES</option>
                <option value="USD">USD</option>
              </select>
            </div>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4">
          <p className="font-semibold text-slate-900">For sale</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the expected purchase price buyers should compare against similar properties.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4">
          <p className="font-semibold text-slate-900">For rent</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the recurring rental amount so the listing reads clearly at a glance.
          </p>
        </div>
      </div>
    </div>
  );
}
