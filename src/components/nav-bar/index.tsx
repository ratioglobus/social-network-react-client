import React from "react";
import { BsPostcard } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export const NavBar: React.FC = () => {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 text-xl px-3 py-2 rounded-lg transition-colors
     ${
       isActive
         ? "bg-primary text-white"
         : "text-foreground hover:bg-gray-200 dark:hover:bg-gray-700"
     }`;

  return (
    <nav>
      <ul className="flex flex-col gap-5">
        <li>
          <NavLink to="/" className={linkClasses}>
            <BsPostcard />
            Посты
          </NavLink>
        </li>
        <li>
          <NavLink to="/following" className={linkClasses}>
            <FiUsers />
            Подписки
          </NavLink>
        </li>
        <li>
          <NavLink to="/followers" className={linkClasses}>
            <FaUsers />
            Подписчики
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
