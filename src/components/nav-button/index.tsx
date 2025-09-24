import type { ReactElement } from "react";
import React from "react";
import { NavLink } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  icon: ReactElement;
  to: string;
};

export const NavButton: React.FC<Props> = ({ children, icon, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 text-xl px-3 py-2 rounded-lg transition ${
          isActive ? "bg-primary text-white" : "hover:bg-gray-200"
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  );
};
