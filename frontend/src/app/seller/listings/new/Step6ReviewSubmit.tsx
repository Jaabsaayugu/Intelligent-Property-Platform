import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/schemas/property.schema";

type Props = {
  form: UseFormReturn<PropertyFormData>;
  isSubmitting: boolean;
};

export default function Step6ReviewSubmit({ form, isSubmitting }: Props) {
  const values = form.getValues();

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { label: "Title", value: values.title || "Not provided" },
          {
            label: "Location",
            value: [values.address, values.city].filter(Boolean).join(", ") || "Not provided",
          },
          { label: "Type", value: values.propertyType || "Not provided" },
          { label: "Status", value: values.status || "Not provided" },
          { label: "Bedrooms", value: values.bedrooms?.toString() || "Not specified" },
          {
            label: "Price",
            value: values.price ? `${values.currency} ${values.price.toLocaleString()}` : "Not provided",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {item.label}
            </p>
            <p className="mt-3 text-base font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Description
        </p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
          {values.description || "No description provided."}
        </p>
      </div>

      <div className="rounded-[1.5rem] bg-slate-950 px-5 py-5 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
          Final check
        </p>
        <div className="mt-4 space-y-3 text-sm leading-7 text-white/80">
          <p>Images added: {values.images?.length || 0}</p>
          <p>Make sure the title, description, and price all feel aligned.</p>
          <p>Review the listing as if you were seeing it for the first time.</p>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#0f2747] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b1d35] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Ready to publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
