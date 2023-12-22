import React from "react";
import SidebarBtnElement from "./SidebarBtnElement";
import { TextFieldFormElement } from "./fields/TextField";

function DesignerSidebar() {
  return (
    <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
      <SidebarBtnElement formElement={TextFieldFormElement} />
    </aside>
  );
}

export default DesignerSidebar;
