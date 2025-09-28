import { Header } from "../header";
import { Container } from "../container";
import { NavBar } from "../nav-bar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, selectCurrent, setCurrent } from "../../features/userSlice";
import { useEffect, useState } from "react";
import { Profile } from "../profile";
import { useLazyCurrentQuery } from "../../app/services/userApi";
import { ScrollToTopButton } from "../scroll-to-top-button";
import { FiMenu } from "react-icons/fi";

export const Layout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrent);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const [triggerCurrent] = useLazyCurrentQuery();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else if (!currentUser) {
      triggerCurrent()
        .unwrap()
        .then(user => dispatch(setCurrent(user)))
        .catch(() => {});
    }
  }, [isAuthenticated, navigate, currentUser, dispatch, triggerCurrent]);

  const isUserProfilePage = pathname.startsWith("/users/");

  return (
    <>
      <Header />
      <Container>
        <div className="flex-2 p-4 hidden lg:block">
          <NavBar />
        </div>

        {/* Центральная колонка с лентой */}
        <div className="flex-1 p-4">
          {/* Кнопка бургер-меню на мобильных */}
          <div className="lg:hidden mb-3 flex justify-start">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-md text-white"
            >
              <FiMenu size={24} />
            </button>
          </div>

          <Outlet />
        </div>

        {/* Правая колонка профиль, только для десктопа */}
        <div className="flex-2 p-4 hidden lg:block">
          <div className="flex-col flex gap-5">
            {currentUser && !isUserProfilePage && <Profile user={currentUser} />}
          </div>
        </div>
      </Container>

      {/* Off-canvas меню на мобильных */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setIsMenuOpen(false)} // клик по фону закрывает меню
        >
          <div
            className="fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <NavBar onClose={() => setIsMenuOpen(false)} /> {/* колбэк закрытия */}
          </div>
        </div>
      )}

      <ScrollToTopButton />
    </>
  );
};
