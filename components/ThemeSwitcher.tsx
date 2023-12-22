"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // avoid rehydration errors
  return (
    <Tabs defaultValue={theme}>
      <TabsList className="border rounded-full py-[1.1rem] px-1">
        <TabsTrigger
          value="light"
          className=" rounded-full"
          onClick={() => setTheme("light")}
        >
          <SunIcon className="h-[1.4rem] w-[1.4rem]" />
        </TabsTrigger>
        <TabsTrigger
          value="dark"
          className=" rounded-full"
          onClick={() => setTheme("dark")}
        >
          <MoonIcon className="h-[1.4rem] w-[1.4rem] rotate-90 transition-all dark:rotate-0" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default ThemeSwitcher;
