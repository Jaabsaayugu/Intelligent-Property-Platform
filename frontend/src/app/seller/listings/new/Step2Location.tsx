import { useEffect, useMemo } from "react";
import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import { kenyaLocationData } from "@/lib/kenya-location-data";
import { PropertyFormData } from "@/schemas/property.schema";

type Props = {
  form: UseFormReturn<PropertyFormData>;
  isSubmitting?: boolean;
};

export default function Step2Location({ form }: Props) {
  const errors = form.formState.errors;
  const county = useWatch({ control: form.control, name: "county" });
  const subCounty = useWatch({ control: form.control, name: "subCounty" });
  const ward = useWatch({ control: form.control, name: "ward" });
  const area = useWatch({ control: form.control, name: "area" });
  const exactLocation = useWatch({ control: form.control, name: "exactLocation" });

  const countyOptions = kenyaLocationData;
  const subCountyOptions = useMemo(
    () => countyOptions.find((item) => item.name === county)?.subCounties ?? [],
    [county]
  );
  const wardOptions = useMemo(
    () => subCountyOptions.find((item) => item.name === subCounty)?.wards ?? [],
    [subCounty, subCountyOptions]
  );
  const areaOptions = useMemo(
    () => wardOptions.find((item) => item.name === ward)?.areas ?? [],
    [ward, wardOptions]
  );

  useEffect(() => {
    if (!county) {
      form.setValue("subCounty", "");
      form.setValue("ward", "");
      form.setValue("area", "");
      return;
    }

    const isValidSubCounty = subCountyOptions.some((item) => item.name === subCounty);
    if (!isValidSubCounty) {
      form.setValue("subCounty", "");
      form.setValue("ward", "");
      form.setValue("area", "");
    }
  }, [county, form, subCounty, subCountyOptions]);

  useEffect(() => {
    if (!subCounty) {
      form.setValue("ward", "");
      form.setValue("area", "");
      return;
    }

    const isValidWard = wardOptions.some((item) => item.name === ward);
    if (!isValidWard) {
      form.setValue("ward", "");
      form.setValue("area", "");
    }
  }, [form, subCounty, ward, wardOptions]);

  useEffect(() => {
    if (!ward) {
      form.setValue("area", "");
      return;
    }

    const isValidArea = areaOptions.some((item) => item.name === area);
    if (!isValidArea) {
      form.setValue("area", "");
    }
  }, [area, areaOptions, form, ward]);

  useEffect(() => {
    const selectedArea = areaOptions.find((item) => item.name === area);
    const composedAddress = [exactLocation, area, ward].filter(Boolean).join(", ");

    if (county) {
      form.setValue("county", county, { shouldValidate: true });
    }
    if (subCounty) {
      form.setValue("city", subCounty, { shouldValidate: true });
    }
    if (composedAddress) {
      form.setValue("address", composedAddress, { shouldValidate: true });
    }
    if (selectedArea) {
      form.setValue("latitude", selectedArea.latitude, { shouldValidate: true });
      form.setValue("longitude", selectedArea.longitude, { shouldValidate: true });
    }
  }, [area, areaOptions, county, exactLocation, form, subCounty, ward]);

  const mapQuery = encodeURIComponent(
    [exactLocation, area, ward, subCounty, county].filter(Boolean).join(", ")
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <Controller
          control={form.control}
          name="county"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">County</label>
              <select
                {...field}
                value={field.value || ""}
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
              >
                <option value="">Pick a county</option>
                {countyOptions.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-rose-600">{errors.county?.message}</p>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="subCounty"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Subcounty</label>
              <select
                {...field}
                value={field.value || ""}
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
                disabled={!county}
              >
                <option value="">Pick a subcounty</option>
                {subCountyOptions.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-rose-600">{errors.subCounty?.message}</p>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="ward"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Ward</label>
              <select
                {...field}
                value={field.value || ""}
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
                disabled={!subCounty}
              >
                <option value="">Pick a ward</option>
                {wardOptions.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-rose-600">{errors.ward?.message}</p>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="area"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Area</label>
              <select
                {...field}
                value={field.value || ""}
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
                disabled={!ward}
              >
                <option value="">Pick an area</option>
                {areaOptions.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-rose-600">{errors.area?.message}</p>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="exactLocation"
          render={({ field }) => (
            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Exact location
              </label>
              <input
                {...field}
                value={field.value || ""}
                placeholder="House name, street, landmark, or gate number"
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
              />
              <p className="text-xs text-rose-600">{errors.exactLocation?.message}</p>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Latitude</label>
              <input
                type="number"
                step="any"
                value={field.value ?? ""}
                onChange={(event) =>
                  field.onChange(event.target.value ? Number(event.target.value) : undefined)
                }
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
              />
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Longitude</label>
              <input
                type="number"
                step="any"
                value={field.value ?? ""}
                onChange={(event) =>
                  field.onChange(event.target.value ? Number(event.target.value) : undefined)
                }
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
              />
            </div>
          )}
        />
      </div>

      <div className="rounded-[1.5rem] border border-slate-200 bg-white/75 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Location preview
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          County: {county || "Not selected"} | Subcounty: {subCounty || "Not selected"} | Ward:{" "}
          {ward || "Not selected"} | Area: {area || "Not selected"}
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Listing address saved as: {[exactLocation, area, ward].filter(Boolean).join(", ") || "Waiting for exact location"}
        </p>
      </div>

      {mapQuery && (
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
          <iframe
            title="Property location preview"
            src={`https://www.google.com/maps?q=${mapQuery}&z=14&output=embed`}
            className="h-[300px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Location note
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Buyers respond best when the place feels precise and trustworthy. Pick the
          county path, add the exact landmark, and fine-tune the coordinates if needed.
        </p>
      </div>
    </div>
  );
}
