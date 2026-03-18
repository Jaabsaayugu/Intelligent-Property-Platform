import { UseFormReturn, ControllerFieldState, ControllerRenderProps, UseFormStateReturn } from "react-hook-form";
import { PropertyFormData } from "@/schemas/property.schema";
import {  FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = { form: UseFormReturn<PropertyFormData> };

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  render: (props: {
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<T>;
  }) => React.ReactElement; // <- must return ReactElement
}

export function FormField<T extends FieldValues>({
  control,
  name,
  render,
}: FormFieldProps<T>) {
  return <Controller control={control} name={name} render={render} />;
}

export default function Step1BasicInfo({ form }: Props) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Modern 4 Bedroom Villa in Westlands" {...field} />
            </FormControl>
            <FormMessage>Required field</FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea rows={5} placeholder="Detailed description..." {...field} />
            </FormControl>
            <FormMessage>Required field</FormMessage>
          </FormItem>
        )}
      />

      {/* Add Select for propertyType and status similarly */}
    </div>
  );
}