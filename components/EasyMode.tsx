import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { FaHandsHelping } from "react-icons/fa";
import FormElementsSidebar from "./FormElementsSidebar";
import useDesigner from "./hooks/useDesigner";

const EasyMode = () => {
  const { setIsEasyMode } = useDesigner();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          className="gap-2 drop-shadow-[0_1.2px_5.2px_rgba(129,140,248,1)] dark:drop-shadow-[0_1.2px_5.2px_rgba(129,140,248,1)]"
          onClick={() => setIsEasyMode(true)}
        >
          <FaHandsHelping className="h-4 w-4" />
          Easy mode
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="h-screen max-h-[95vh] overflow-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Which type of field you want to add?
          </AlertDialogTitle>
          <AlertDialogDescription onClick={() => console.log("CUM")}>
            Just click to add it!
            <FormElementsSidebar easy />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsEasyMode(false)}>
            Cancel
          </AlertDialogCancel>
          {/* <AlertDialogAction
          disabled={loading}
          onClick={(e) => {
            e.preventDefault();
            startTransition(publishForm);
          }}
        > */}
          {/* Proceed {loading && <FaSpinner className="animate-spin" />} */}
          {/* </AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EasyMode;
