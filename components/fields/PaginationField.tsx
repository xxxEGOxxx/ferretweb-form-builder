"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../FormElements";
import { Label } from "../ui/label";

import { FaBookOpen } from "react-icons/fa";
import { Separator } from "../ui/separator";

const type: ElementsType = "PaginationField";

export const PaginationFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    isVisible: {},
  }),
  designerBtnElement: {
    icon: FaBookOpen,
    label: "New page field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">New page field</Label>
      <Separator />
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return <Separator />;
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return <p>No properties for this element</p>;
}
