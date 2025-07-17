import { Routes, Route, Navigate } from "react-router-dom";

import useAuth from "./store/hooks/useAuth";
import NavbarComponent from "./components/ui/elements/Navbar";
import PersistLogin from "./components/login-user/PersistLogin";
import RequireAuth from "./components/login-user/RequireAuth";
import Page404 from "./pages/page404";
import HomePage from "./pages/home-page/HomePage";
import DashboardPage from "./pages/dashboard-page/DashboardPage";
import LoginPage from "./pages/login-page/LoginPage";
import RegisterPage from "./pages/register-page/RegisterPage";
import TransactionPage from "./pages/transaction-page/TransactionPage";
import CategoryPage from "./pages/category-page/CategoryPage";
import PrintTransactionPage from "./pages/print-transaction-page/PrintTransactionPage";

function App() {
  const { auth } = useAuth();
  return (
    <div className="app-wrapper">
      <NavbarComponent />

      <div className="app-content">
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

          <Route path="/home" element={<HomePage />} />

          {/* Protected Routes */}
          <Route element={<PersistLogin />}>
            <Route
              path="/login"
              element={
                auth?.email && auth?.accessToken ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage />
                )
              }
            />

            <Route
              path="/register"
              element={
                auth?.email && auth?.accessToken ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <RegisterPage />
                )
              }
            />

            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionPage />} />
              <Route
                path="/transactions/print"
                element={<PrintTransactionPage />}
              />
              <Route path="/categories" element={<CategoryPage />} />
            </Route>
          </Route>

          {/* Invalid Paths */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
