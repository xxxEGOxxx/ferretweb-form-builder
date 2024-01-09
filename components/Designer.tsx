"use client";

import React, { useState } from "react";
import DesignerSidebar from "./DesignerSidebar";
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import useDesigner from "./hooks/useDesigner";
import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from "./FormElements";
import { idGenerator } from "@/lib/idGenerator";
import { Button } from "./ui/button";
import { BiSolidTrash } from "react-icons/bi";
import SidebarBtnElement, { SidebarBtnElementHint } from "./SidebarBtnElement";

function Designer() {
  const {
    elements,
    addElement,
    selectedElement,
    setSelectedElement,
    removeElement,
    isEasyMode,
  } = useDesigner();

  console.log(elements);

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over) return;
      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea =
        over.data?.current?.isDesignerDropArea;

      const droppingSidebarBtnOverDesignerDropArea =
        isDesignerBtnElement && isDroppingOverDesignerDropArea;

      //Easy mode scenario
      if (isEasyMode) {
        // In easy mode we only allow dragging sidebar buttons into the designer area
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(
          idGenerator(elements)
        );
        console.log(newElement);
        addElement(elements.length, newElement);
        return;
      }

      // First scenario
      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(
          idGenerator(elements)
        );
        console.log(newElement);
        addElement(elements.length, newElement);
        return;
      }

      const isDroppingOverDesignerElementTopHalf =
        over.data?.current?.isTopHalfDesignerElement;

      const isDroppingOverDesignerElementBottomHalf =
        over.data?.current?.isBottomHalfDesignerElement;

      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf;

      const droppingSidebarBtnOverDesignerElement =
        isDesignerBtnElement && isDroppingOverDesignerElement;

      // Second scenario
      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(
          idGenerator(elements)
        );

        const overId = over.data?.current?.elementId;

        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (overElementIndex === -1) {
          throw new Error("element not found");
        }

        let indexForNewElement = overElementIndex; // i assume i'm on top-half
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }

        addElement(indexForNewElement, newElement);
        return;
      }

      // Third scenario
      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;

      const draggingDesignerElementOverAnotherDesignerElement =
        isDroppingOverDesignerElement && isDraggingDesignerElement;

      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId;
        const overId = over.data?.current?.elementId;

        const activeElementIndex = elements.findIndex(
          (el) => el.id === activeId
        );

        const overElementIndex = elements.findIndex((el) => el.id === overId);

        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("element not found");
        }

        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);

        let indexForNewElement = overElementIndex; // i assume i'm on top-half
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }

        addElement(indexForNewElement, activeElement);
      }
    },
  });

  return (
    <div className="flex w-full h-full">
      <div
        className="p-4 w-full"
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
            droppable.isOver && "ring-4 ring-primary ring-inset"
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
              Drop here
            </p>
          )}

          {droppable.isOver && elements.length === 0 && (
            <div className="p-4 w-full">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}
          {elements.length > 0 && (
            <div className="flex flex-col  w-full gap-2 p-4">
              {elements.map((element) => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
}

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  const {
    removeElement,
    selectedElement,
    setSelectedElement,
    updateElement,
    elements,
    isEasyMode,
  } = useDesigner();

  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null; // temporary remove the element from designer

  const DesignerElement = FormElements[element.type].designerComponent;
  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
        // isEasyMode &&
      }}
    >
      <div
        ref={topHalf.setNodeRef}
        className="absolute w-full h-1/2 rounded-t-md"
      />
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute w-full bottom-0 h-1/2 rounded-b-md"
      />
      {mouseIsOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button
              className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500"
              variant={"outline"}
              onClick={(e) => {
                e.stopPropagation(); // avoid selection of element while deleting
                elements.map((checkedElement) => {
                  if (
                    checkedElement.extraAttributes?.relatedElements?.includes(
                      element.id
                    )
                  ) {
                    const newRelatedElements: string[] | undefined[] =
                      checkedElement.extraAttributes.relatedElements.filter(
                        (relatedElement: string) =>
                          relatedElement !== element.id
                      );
                    updateElement(checkedElement.id, {
                      ...checkedElement,
                      extraAttributes: {
                        ...checkedElement.extraAttributes,
                        relatedElements: newRelatedElements,
                      },
                    });
                  } else if (element.id in checkedElement.isVisible) {
                    checkedElement.isVisible[element.id] = undefined;
                    console.log("Is still visible", checkedElement.isVisible);
                  }
                });
                removeElement(element.id);
              }}
            >
              <BiSolidTrash className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-muted-foreground text-sm">
              Click for properties or drag to move
            </p>
          </div>
        </>
      )}
      {topHalf.isOver && (
        <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none" />
      )}
      <div
        className={cn(
          "flex w-full gap-2 h-[120px] items-center justify-between rounded-md bg-accent/40 pointer-events-none opacity-100 overflow-clip",
          mouseIsOver && "opacity-30"
        )}
      >
        <div className="flex items-center w-full gap-2 h-full">
          <div className="border-r dark:border-primary-foreground border-primary/10 text-primary/40 px-1 w-[50px] min-w-[50px] h-full flex items-center justify-center ">
            <div>{element.id}</div>
          </div>
          <DesignerElement elementInstance={element} />
        </div>
        <SidebarBtnElementHint
          formElement={FormElements[element.type]}
          noOutline
        />
      </div>
      {bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none" />
      )}
    </div>
  );
}

export default Designer;
