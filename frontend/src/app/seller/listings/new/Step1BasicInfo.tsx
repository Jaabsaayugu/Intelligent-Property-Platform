import { Controller, UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/schemas/property.schema";

type Props = {
  form: UseFormReturn<PropertyFormData>;
  isSubmitting?: boolean;
};

export default function Step1BasicInfo({ form }: Props) {
  const errors = form.formState.errors;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <Controller
          control={form.control}
          name="title"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Property title
              </label>
              <input
                {...field}
                placeholder="Modern 4 bedroom villa in Westlands"
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
              <p className="text-xs text-slate-500">
                Use clear, specific language that helps buyers picture the property quickly.
              </p>
              <p className="text-xs text-rose-600">
                {errors.title?.message}
              </p>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Property type
              </label>
              <select
                {...field}
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
                <option value="other">Other</option>
              </select>
              <p className="text-xs text-rose-600">
                {errors.propertyType?.message}
              </p>
            </div>
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              {...field}
              rows={7}
              placeholder="Describe the layout, neighborhood feel, design quality, and standout features."
              className="block w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            />
            <p className="text-xs text-rose-600">
              {errors.description?.message}
            </p>
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="status"
        render={({ field }) => (
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              Listing purpose
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: "sale", title: "For sale", detail: "Best for outright purchase listings." },
                { value: "rent", title: "For rent", detail: "Best for monthly or periodic rental listings." },
              ].map((option) => {
                const active = field.value === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(option.value)}
                    className={`rounded-[1.5rem] border px-5 py-4 text-left transition ${
                      active
                        ? "border-teal-700 bg-teal-50 shadow-[0_12px_30px_-20px_rgba(15,118,110,0.75)]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{option.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{option.detail}</p>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-rose-600">
              {errors.status?.message}
            </p>
          </div>
        )}
      />
    </div>
  );
}
