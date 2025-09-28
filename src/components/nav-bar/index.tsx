import React from "react";
import { BsPostcard } from "react-icons/bs";
import { FiUser, FiUsers, FiX } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrent } from "../../features/userSlice";

type NavBarProps = {
  onClose?: () => void;
};

export const NavBar: React.FC<NavBarProps> = ({ onClose }) => {
  const currentUser = useSelector(selectCurrent);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 text-xl px-3 py-2 rounded-lg transition-colors
     ${isActive
      ? "bg-primary text-white"
      : "text-foreground hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <nav className="flex flex-col gap-5">
      {/* Кнопка закрытия для мобильного меню */}
      {onClose && (
        <button
          onClick={onClose}
          className="self-end mb-3 p-2 rounded-md text-white bg-gray-700 hover:bg-gray-600 lg:hidden"
        >
          <FiX size={24} />
        </button>
      )}

      {/* Ссылки */}
      <NavLink to="/" className={linkClasses} onClick={handleLinkClick}>
        <BsPostcard />
        Лента
      </NavLink>

      {currentUser && (
        <NavLink
          to={`/users/${currentUser.id}`}
          className={linkClasses}
          onClick={handleLinkClick}
        >
          <FiUser />
          Мой профиль
        </NavLink>
      )}

      <NavLink to="/following" className={linkClasses} onClick={handleLinkClick}>
        <FiUsers />
        Мои подписки
      </NavLink>

      <NavLink to="/followers" className={linkClasses} onClick={handleLinkClick}>
        <FaUsers />
        Мои подписчики
      </NavLink>
    </nav>
  );
};
