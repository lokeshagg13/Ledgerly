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
import TransactionPage from "./pages/transaction-page/TransactionPage";
import CategoryPage from "./pages/category-page/CategoryPage";

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
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        <Route path="/home" element={<Home />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route
            path="/login"
            element={
              auth?.email && auth?.accessToken ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/register"
            element={
              auth?.email && auth?.accessToken ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register />
              )
            }
          />

          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<HomeLogged />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/categories" element={<CategoryPage />} />
          </Route>
        </Route>

        {/* Invalid Paths */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;
