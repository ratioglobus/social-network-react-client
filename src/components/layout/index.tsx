import { Header } from "../header";
import { Container } from "../container";
import { NavBar } from "../nav-bar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, selectCurrent, setCurrent } from "../../features/userSlice";
import { useEffect } from "react";
import { Profile } from "../profile";
import { useLazyCurrentQuery } from "../../app/services/userApi";

export const Layout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrent);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const [triggerCurrent] = useLazyCurrentQuery();

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
        <div className="flex-2 p-4">
          <NavBar />
        </div>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
        <div className="flex-2 p-4">
          <div className="flex-col flex gap-5">
            {currentUser && !isUserProfilePage && <Profile user={currentUser} />}
          </div>
        </div>
      </Container>
    </>
  );
};
