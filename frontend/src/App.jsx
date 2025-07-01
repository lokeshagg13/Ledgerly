import { Routes, Route, Navigate } from "react-router-dom";

import useAuth from "./store/hooks/useAuth";
import NavbarComponent from "./components/ui/Navbar";
import PersistLogin from "./components/login-user/PersistLogin";
import RequireAuth from "./components/login-user/RequireAuth";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomeLogged from "./pages/HomeLogged";
import Page404 from "./pages/page404";

function App() {
  const { auth } = useAuth();
  return (
    <>
      <NavbarComponent />

      <Routes>
        <Route
          exact
          path="/"
          element={
            auth?.email && auth?.accessToken ? (
              <Navigate to="/homeLogged" replace />
            ) : (
              <Navigate to="/ledgerly" replace />
            )
          }
        />
        <Route path="/ledgerly" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/homeLogged" element={<HomeLogged />} />
          </Route>
        </Route>

        {/* Invalid Paths */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;
