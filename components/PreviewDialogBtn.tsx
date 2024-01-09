"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { MdPreview } from "react-icons/md";
import useDesigner from "./hooks/useDesigner";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { FormElements } from "./FormElements";
import PaginationSection from "./PaginationSection";

function PreviewDialogBtn() {
  const [isClient, setIsClient] = useState(false);
  const { elements, setSavedElements, savedElements } = useDesigner();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can adjust this value

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = savedElements.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => setSavedElements(elements)}
          variant={"outline"}
          className="gap-2"
        >
          <MdPreview className="h-6 w-6" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
        <div className="px-4 py-2 border-b">
          <p className="text-lg font-bold text-muted-foreground">
            Form preview
          </p>
          <p className="text-sm text-muted-foreground">
            This is how your form will look like to your users.
          </p>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] overflow-y-auto">
          <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
            <div className="flex flex-col gap-4 flex-grow">
              {currentItems.map((element) => {
                /// pagination should be implemented to this elements
                console.log("PREVIEW", element);
                for (const key in element.isVisible) {
                  if (element.isVisible[key] === false) return;
                }

                const FormComponent = FormElements[element.type].formComponent;

                return (
                  <FormComponent key={element.id} elementInstance={element} />
                );
              })}
            </div>
            <PaginationSection
              totalItems={savedElements.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewDialogBtn;
