// // Step2Location.tsx
// import { UseFormReturn, Controller } from "react-hook-form";
// import { PropertyFormData, propertySchema } from "@/schemas/property.schema";
// import {
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";

// type Props = { form: UseFormReturn<PropertyFormData> };

// export default function Step2Location({ form }: Props) {
//   return (
//     <div className="space-y-6">
//       <Controller
//         control={form.control}
//         name="address"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Location / Address *</FormLabel>
//             <FormControl>
//               <Input
//                 placeholder="e.g. Westlands, Nairobi" // or full address
//                 {...field}
//               />
//             </FormControl>
//             <FormMessage>Required field</FormMessage>
//             <p className="text-xs text-muted-foreground mt-1">
//               Be as specific as possible (area, town, county)
//             </p>
//           </FormItem>
//         )}
//       />

//       {/* You can later add Google Places Autocomplete here */}
//     </div>
//   );
// }

// Step2Location.tsx
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

export default function Step2Location({ form }: Props) {
  return (
    <div className="space-y-6">
      <Controller
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Address / Street *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Muthaiga North, Off Kiambu Road"
                {...field}
              />
            </FormControl>
            <FormMessage>Required field</FormMessage>
          </FormItem>
        )}
      />

      <Controller
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City / Town *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Nairobi, Mombasa, Kisumu"
                {...field}
              />
            </FormControl>
            <FormMessage>Required field</FormMessage>
          </FormItem>
        )}
      />

      {/* Optional fields – can be added later */}
      {/* <Controller name="county" ... /> */}
      {/* <Controller name="latitude" ... /> etc. */}

      <p className="text-xs text-muted-foreground">
        Be as specific as possible. This helps buyers find your property.
      </p>
    </div>
  );
}