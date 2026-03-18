// Step6ReviewSubmit.tsx
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/schemas/property.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  form: UseFormReturn<PropertyFormData>;
  isSubmitting: boolean;
};

export default function Step6ReviewSubmit({ form, isSubmitting }: Props) {
  const values = form.getValues();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Review Your Listing</h3>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Title</p>
              <p>{values.title || "—"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p>{values.address || "—"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Bedrooms</p>
              <p>{values.bedrooms ?? "Not specified"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Price</p>
              <p>
                {values.price
                  ? `KES ${values.price.toLocaleString()}`
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="whitespace-pre-wrap">{values.description || "—"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Images</p>
              <p>{values.images?.length || 0} image(s) added</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg text-sm">
        <p className="font-medium">Before submitting:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
          <li>Double-check all information for accuracy</li>
          <li>Ensure images are high quality and relevant</li>
          <li>Make sure the price is realistic for the market</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="lg:px-8">
          {isSubmitting ? "Submitting..." : "Publish Property"}
        </Button>
      </div>
    </div>
  );
}