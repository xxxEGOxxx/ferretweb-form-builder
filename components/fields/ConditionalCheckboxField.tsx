"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  FormElements,
  SubmitFunction,
} from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { object, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useReducer, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import { GiCheckboxTree } from "react-icons/gi";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
  construct: (id: string) => {
    console.log("NEW EXTRAATTRIBUTES", extraAttributes);
    return {
      id,
      type,
      isVisible: {},
      extraAttributes: {
        label: "Conditional Checkbox field",
        helperText: "Helper text",
        relatedElements: [] as string[],
        required: false,
      },
    };
  },
  designerBtnElement: {
    icon: GiCheckboxTree,
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

  const { savedElements, updateSavedElement } = useDesigner();

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
          savedElements.map((savedElement) => {
            for (const key in savedElement.isVisible) {
              if (
                value &&
                key === element.id &&
                savedElement.isVisible[key] === false
              ) {
                updateSavedElement(savedElement.id, {
                  ...savedElement,
                  isVisible: {
                    ...savedElement.isVisible,
                    [key]: true,
                  },
                });
              } else if (
                !value &&
                key === element.id &&
                savedElement.isVisible[key] === true
              ) {
                updateSavedElement(savedElement.id, {
                  ...savedElement,
                  isVisible: {
                    ...savedElement.isVisible,
                    [key]: false,
                  },
                });
              }
            }
          });

          console.log("Checked");
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
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      relatedElements: element.extraAttributes.relatedElements,
      required: element.extraAttributes.required,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    console.log("Conditional apply");
    const { label, helperText, required, relatedElements } = values;
    // console.log("RELATED ELEMENT IN APPLY", relatedElements);
    const newRelatedElements = [...element.extraAttributes.relatedElements];
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        relatedElements: newRelatedElements,
        required,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br /> It will be displayed above the
                field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper text</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The helper text of the field. <br />
                It will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-3">
          <FormLabel>Related elements</FormLabel>
          <div className="flex flex-col gap-5">
            <Select>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a related element" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All forms</SelectLabel>
                  <div className="flex flex-col gap-2">
                    {elements.map((existingElement) => {
                      if (element.id === existingElement.id) return null;
                      if (
                        element.type === existingElement.type &&
                        existingElement.extraAttributes?.relatedElements.includes(
                          element.id
                        )
                      )
                        return null;

                      return (
                        <div key={existingElement.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "flex w-full gap-2 pr-4 h-[20px] items-center rounded-md bg-accent/40 opacity-100 overflow-clip"
                              )}
                            >
                              <div className="pointer-events-none flex items-center w-full ">
                                <div className="px-1 w-[50px] min-w-[50px]  h-full flex items-center justify-center border-r dark:border-primary-foreground border-primary/10 text-primary/40">
                                  <div className="">{existingElement.id}</div>
                                </div>
                              </div>

                              <Checkbox
                                className="px-1"
                                id={existingElement.id}
                                checked={element.extraAttributes.relatedElements?.includes(
                                  existingElement.id
                                )}
                                onCheckedChange={(checked) => {
                                  console.log("Checked", checked);
                                  const newElement = { ...element };
                                  if (checked) {
                                    newElement.extraAttributes.relatedElements.push(
                                      existingElement.id
                                    );
                                    updateElement(element.id, {
                                      ...newElement,
                                    });
                                    updateElement(existingElement.id, {
                                      ...existingElement,
                                      isVisible: {
                                        ...existingElement.isVisible,
                                        [element.id]: false,
                                      },
                                    });
                                  } else {
                                    newElement.extraAttributes.relatedElements =
                                      element.extraAttributes.relatedElements.filter(
                                        (id) => id !== existingElement.id
                                      );
                                    console.log("NEWELEMENT", newElement);
                                    updateElement(element.id, {
                                      ...newElement,
                                    });
                                    updateElement(existingElement.id, {
                                      ...existingElement,
                                      isVisible: {
                                        ...existingElement.isVisible,
                                        [element.id]: undefined,
                                      },
                                    });
                                  }
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
                      <div className="pointer-events-none gap-2 flex items-center w-full h-full ">
                        <div className="px-1 w-[50px] min-w-[50px]  h-full flex items-center justify-center border-r dark:border-primary-foreground border-primary/10 text-primary/40">
                          <div className="">{existingElement.id}</div>
                        </div>
                        <DesignerElement elementInstance={existingElement} />
                      </div>

                      <Checkbox
                        className="px-1"
                        id={existingElement.id}
                        checked={element.extraAttributes.relatedElements.includes(
                          existingElement.id
                        )}
                        onCheckedChange={(checked) => {
                          console.log("Checked", checked);
                          const newElement = { ...element };
                          if (checked) {
                            newElement.extraAttributes.relatedElements.push(
                              existingElement.id
                            );
                            updateElement(element.id, {
                              ...newElement,
                            });
                            updateElement(existingElement.id, {
                              ...existingElement,
                              isVisible: {
                                ...existingElement.isVisible,
                                [element.id]: false,
                              },
                            });
                          } else {
                            newElement.extraAttributes.relatedElements =
                              element.extraAttributes.relatedElements.filter(
                                (id) => id !== existingElement.id
                              );
                            console.log("NEWELEMENT", newElement);
                            updateElement(element.id, {
                              ...newElement,
                            });
                            updateElement(existingElement.id, {
                              ...existingElement,
                              isVisible: {
                                ...existingElement.isVisible,
                                [element.id]: undefined,
                              },
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <FormDescription>
            Choose the related elements. <br />
            Checked elements will be shown if checkbox is checked.
          </FormDescription>
          <div />
        </div>
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  The helper text of the field. <br />
                  It will be displayed below the field.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
