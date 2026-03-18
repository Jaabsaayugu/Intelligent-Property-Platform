// Step3Details.tsx
import { UseFormReturn, Controller } from "react-hook-form";
import { PropertyFormData } from "@/schemas/property.schema";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = { form: UseFormReturn<PropertyFormData> };

export default function Step3Details({ form }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g. 4"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage>Required field</FormMessage>
            </FormItem>
          )}
        />

        {/* Optional: add bathrooms if you extend the schema later */}
        {/* <FormField ... name="bathrooms" ... /> */}
      </div>

      <p className="text-sm text-muted-foreground">
        Add more details later (land size, year built, etc.) when schema is extended.
      </p>
    </div>
  );
}