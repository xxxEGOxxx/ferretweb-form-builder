import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <div className="py-1 px-4 rounded-full">
      <Link
        href={"/"}
        className="font-bold text-3xl text-white bg-gradient-to-r hover:cursor-pointer drop-shadow-[0_1.2px_3.2px_rgba(129,140,248,1)] dark:drop-shadow-[0_1.2px_4.2px_rgba(129,140,248,1)]"
      >
        FormBuilder
      </Link>
    </div>
  );
}

export default Logo;
