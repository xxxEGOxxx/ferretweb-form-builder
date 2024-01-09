"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  FormElements,
  SubmitFunction,
} from "../../FormElements";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { object, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useReducer, useState } from "react";
import useDesigner from "../../hooks/useDesigner";
import { IoMdCheckbox } from "react-icons/io";

import { Switch } from "../../ui/switch";
import { cn } from "@/lib/utils";
import { Checkbox } from "../../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const type: ElementsType = "ConditionalCheckboxField";

const extraAttributes = {
  label: "Conditional Checkbox field",
  helperText: "Helper text",
  relatedElements: [] as string[],
  required: false,
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  relatedElements: z.array(z.string()), // fix it
  required: z.boolean().default(false),
});

export const ConditionalCheckboxFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    isVisible: {},
    extraAttributes,
  }),
  designerBtnElement: {
    icon: IoMdCheckbox,
    label: "Conditional Checkbox field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (
    formElement: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formElement as CustomInstance;
    if (element.extraAttributes.required) {
      return currentValue === "true";
    }

    return true;
  },
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, helperText } = element.extraAttributes;
  const id = `ConditionalCheckbox-${element.id}`;
  return (
    <div className="flex items-top space-x-2">
      <Checkbox id={id} />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id}>
          {label}
          {required && "*"}
        </Label>
        {helperText && (
          <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
        )}
      </div>
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const element = elementInstance as CustomInstance;

  const [value, setValue] = useState<boolean>(
    defaultValue === "true" ? true : false
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const { label, required, placeHolder, helperText } = element.extraAttributes;
  const id = `ConditionalCheckbox-${element.id}`;
  return (
    <div className="flex items-top space-x-2">
      <Checkbox
        id={id}
        checked={value}
        className={cn(error && "border-red-500")}
        onCheckedChange={(checked) => {
          let value = false;
          if (checked === true) value = true;

          setValue(value);
          if (!submitValue) return;
          const stringValue = value ? "true" : "false";
          const valid = ConditionalCheckboxFieldFormElement.validate(
            element,
            stringValue
          );
          setError(!valid);
          submitValue(element.id, stringValue);
        }}
      />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id} className={cn(error && "text-red-500")}>
          {label}
          {required && "*"}
        </Label>
        {helperText && (
          <p
            className={cn(
              "text-muted-foreground text-[0.8rem]",
              error && "text-red-500"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { updateElement, elements } = useDesigner();

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    // form.reset(element.extraAttributes);
  }, [element]);

  function applyChanges(values: propertiesFormSchemaType) {
    console.log("Conditional Comp");
    console.log(values);
    const { label, helperText, required, relatedElements } = values;
    console.log(relatedElements);
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        relatedElements,
        required,
      },
    });
    elements.map((relatedElement) => {
      console.log("asd");
      if (element.id === relatedElement.id) return;

      relatedElements.includes(relatedElement.id)
        ? updateElement(relatedElement.id, {
            ...relatedElement,
            isVisible: { ...relatedElement.isVisible, [element.id]: false },
          })
        : updateElement(relatedElement.id, {
            ...relatedElement,
            isVisible: { ...relatedElement.isVisible, [element.id]: undefined },
          });
    });
  }

  return (
    <form
      // onBlur={() => applyChanges(element)}
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-3"
    >
      <div>
        <div>Label</div>

        <Input
          value={element.extraAttributes.label}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />

        <div>
          The label of the field. <br /> It will be displayed above the field
        </div>
        <div />
      </div>

      <div>
        <div>Helper text</div>

        <Input
          value={element.extraAttributes.helperText}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />

        <div>
          The helper text of the field. <br />
          It will be displayed below the field.
        </div>
        <div />
      </div>

      <div className="flex flex-col">
        <div>Related elements</div>
        <div className="flex flex-col gap-5">
          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a related element" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>All forms</SelectLabel>
                {/* <SelectItem value="est">
                    Eastern Standard Time (EST)
                  </SelectItem>
                  <SelectItem value="cst">
                    Central Standard Time (CST)
                  </SelectItem> */}
                <div className="flex flex-col gap-2">
                  {elements.map((existingElement) => {
                    if (element.id === existingElement.id) return null;
                    // const DesignerElement =
                    //   FormElements[existingElement.type].designerComponent;
                    return (
                      <div key={existingElement.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex w-full gap-2 pr-4 h-[20px] items-center rounded-md bg-accent/40 opacity-100 overflow-clip"
                            )}
                          >
                            <div className="pointer-events-none flex items-center w-full ">
                              <div className="px-1 w-[50px] min-w-[50px]  h-full flex items-center justify-center border-r dark:border-primary-foreground border-primary">
                                <div className="">{existingElement.id}</div>
                              </div>
                            </div>

                            <Checkbox
                              className="px-1"
                              id={existingElement.id}
                              // checked={element.extraAttributes.relatedElements.includes(
                              //   parseInt(existingElement.id)
                              // )}
                              checked={element.extraAttributes.relatedElements.includes(
                                existingElement.id
                              )}
                              onCheckedChange={(checked) => {
                                console.log("Checked", checked);

                                return checked
                                  ? updateElement(existingElement.id, {
                                      ...existingElement,
                                      isVisible: {
                                        ...existingElement.isVisible,
                                        [element.id]: false,
                                      },
                                    })
                                  : updateElement(existingElement.id, {
                                      ...existingElement,
                                      isVisible: {
                                        ...existingElement.isVisible,
                                        [element.id]: undefined,
                                      },
                                    });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SelectGroup>
            </SelectContent>
          </Select>
          {elements.map((existingElement) => {
            if (element.id === existingElement.id) return null;
            if (
              !element.extraAttributes.relatedElements?.includes(
                existingElement.id
              )
            )
              return null;
            const DesignerElement =
              FormElements[existingElement.type].designerComponent;
            return (
              <div key={existingElement.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex w-full gap-2 pr-4 h-[120px] items-center rounded-md bg-accent/40 opacity-100 overflow-clip"
                    )}
                  >
                    <div className="pointer-events-none flex items-center w-full ">
                      <div className="px-1 w-[50px] min-w-[50px]  h-full flex items-center justify-center border-r dark:border-primary-foreground border-primary">
                        <div className="">{existingElement.id}</div>
                      </div>
                      <DesignerElement elementInstance={existingElement} />
                    </div>

                    <Checkbox
                      className="px-1"
                      id={existingElement.id}
                      // checked={element.extraAttributes.relatedElements.includes(
                      //   parseInt(existingElement.id)
                      // )}
                      checked={element.extraAttributes.relatedElements.includes(
                        existingElement.id
                      )}
                      onCheckedChange={(checked) => {
                        console.log("Checked");
                        // return checked
                        //   ? field.onChange([
                        //       ...field.value,
                        //       existingElement.id,
                        //     ])
                        //   : field.onChange(
                        //       field.value?.filter(
                        //         (value) => value !== existingElement.id
                        //       )
                        //     );
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          Choose the related elements. <br />
          Checked elements will be shown if checkbox is checked.
        </div>
        <div />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <div>Required</div>
          <div>
            The helper text of the field. <br />
            It will be displayed below the field.
          </div>
        </div>

        <Switch checked={element.extraAttributes.required} />

        <div />
      </div>
    </form>
  );
}
