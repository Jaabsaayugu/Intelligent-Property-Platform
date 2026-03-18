// Step5Images.tsx  (basic version – you can enhance with dropzone later)
import { UseFormReturn, Controller } from "react-hook-form";
import { PropertyFormData } from "@/schemas/property.schema";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import error from "next/error";

type Props = { form: UseFormReturn<PropertyFormData> };

export default function Step5Images({ form }: Props) {
  const images = form.watch("images") || [];

  const addImage = () => {
    const current = form.getValues("images") || [];
    form.setValue("images", [...current, ""]);
  };

  const removeImage = (index: number) => {
    const current = form.getValues("images") || [];
    form.setValue(
      "images",
      current.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <FormLabel>Property Images *</FormLabel>
      <p className="text-sm text-muted-foreground mb-4">
        Add direct image URLs (you can upload later via Cloudinary/S3 integration)
      </p>

      {images.map((_, index) => (
        <Controller
          key={index}
          control={form.control}
          name={`images.${index}`}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...field}
                    className="flex-1"
                  />
                </FormControl>
                <FormMessage>
          {form.formState.errors.images?.[index]?.message as string}
        </FormMessage>
              </FormItem>
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
      ))}

      <Button type="button" variant="outline" onClick={addImage}>
        + Add Image URL
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        Tip: In production, replace this with a proper file upload + preview component (react-dropzone + presigned URLs)
      </p>
    </div>
  );
}