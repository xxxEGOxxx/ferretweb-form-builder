import React from "react";
import SidebarBtnElement from "./SidebarBtnElement";
import { FormElements } from "./FormElements";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

function FormElementsSidebar({ easy }: { easy?: boolean }) {
  return (
    <div>
      {easy || (
        <p className="text-sm text-foreground/70">Drag and drop elements</p>
      )}
      <Separator className="my-2" />

      <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
        Layout elements
      </p>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center",
          easy && "md:grid-cols-3"
        )}
      >
        <SidebarBtnElement formElement={FormElements.TitleField} />
        <SidebarBtnElement formElement={FormElements.SubTitleField} />
        <SidebarBtnElement formElement={FormElements.ParagraphField} />
        <SidebarBtnElement formElement={FormElements.SeparatorField} />
        <SidebarBtnElement formElement={FormElements.SpacerField} />
      </div>
      <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
        Form elements
      </p>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center",
          easy && "md:grid-cols-3"
        )}
      >
        <SidebarBtnElement formElement={FormElements.TextField} />
        <SidebarBtnElement formElement={FormElements.NumberField} />
        <SidebarBtnElement formElement={FormElements.TextAreaField} />
        <SidebarBtnElement formElement={FormElements.DateField} />
        <SidebarBtnElement formElement={FormElements.SelectField} />
        <SidebarBtnElement formElement={FormElements.CheckboxField} />
      </div>
      <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
        Advanced elements
      </p>
      <SidebarBtnElement formElement={FormElements.ConditionalCheckboxField} />
      {/* <SidebarBtnElement formElement={FormElements.PaginationField} /> */}
    </div>
  );
}

export default FormElementsSidebar;
