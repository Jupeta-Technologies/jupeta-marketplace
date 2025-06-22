// components/NavWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import NavBar from "./navbar/JupetaECnavBar";

const NavWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const hideNav = pathname === "/Login";

  return (
    <>
      {!hideNav && <NavBar />}
      {children}
    </>
  );
};

export default NavWrapper;
