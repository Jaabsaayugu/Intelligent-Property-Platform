// Step4Pricing.tsx
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

export default function Step4Pricing({ form }: Props) {
  return (
    <div className="space-y-6">
      <Controller
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price (KES) *</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="e.g. 12500000"
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage>Required field</FormMessage>
          </FormItem>
        )}
      />

      <div className="text-sm text-muted-foreground space-y-1">
        <p>• For rent listings, enter monthly rent</p>
        <p>• For sale, enter asking price</p>
      </div>
    </div>
  );
}