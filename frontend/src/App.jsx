import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "./store/hooks/useAuth";
import NavbarComponent from "./components/ui/navbar/Navbar";
import PersistLogin from "./components/user/session/PersistLogin";
import RequireAuth from "./components/user/session/RequireAuth";
import Page404 from "./pages/page404";
import HomePage from "./pages/home-page/HomePage";
import DashboardPage from "./pages/dashboard-page/DashboardPage";
import LoginOptionsPage from "./pages/login-options-page/LoginOptionsPage";
import LoginIndividualPage from "./pages/login-individual-page/LoginIndividualPage";
import LoginFirmPage from "./pages/login-firm-page/LoginFirmPage";
import RegisterPage from "./pages/register-page/RegisterPage";
import UserProfilePage from "./pages/user-profile-page/UserProfilePage";
import TransactionPage from "./pages/transaction-page/TransactionPage";
import CategoryPage from "./pages/category-page/CategoryPage";
import UploadTransactionPage from "./pages/upload-transaction-page/UploadTransactionPage";
import PrintTransactionPage from "./pages/print-transaction-page/PrintTransactionPage";
import HeadsPage from "./pages/heads-page/HeadsPage";
import SummaryPage from "./pages/summary-page/SummaryPage";
import EntrySetsPage from "./pages/entry-sets-page/EntrySetsPage";
import UploadHeadsPage from "./pages/upload-heads-page/UploadHeadsPage";
import NewEntrySetPage from "./pages/new-entry-set-page/NewEntrySetPage";
import ViewEntrySetPage from "./pages/view-entry-set-page/ViewEntrySetPage";
import EditEntrySetPage from "./pages/edit-entry-set-page/EditEntrySetPage";

function App() {
  const { auth } = useAuth();

  return (
    <div className="app-wrapper">
      <NavbarComponent />

      <div className="app-content">
        <Routes>
          <Route path="/home" element={<HomePage />} />

          {/* Protected Routes */}
          <Route element={<PersistLogin />}>
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

            <Route
              path="/login"
              element={
                auth?.email && auth?.accessToken ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginOptionsPage />
                )
              }
            />

            <Route
              path="/individual-login"
              element={
                auth?.email && auth?.accessToken ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginIndividualPage />
                )
              }
            />

            <Route
              path="/firm-login"
              element={
                auth?.email && auth?.accessToken ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginFirmPage />
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
              <Route path="/user-profile" element={<UserProfilePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Individual-only routes */}
              <Route
                path="/transactions"
                element={
                  auth?.type === "individual" ? (
                    <TransactionPage />
                  ) : (
                    <Page404 />
                  )
                }
              />
              <Route
                path="/print-transactions"
                element={
                  auth?.type === "individual" ? (
                    <PrintTransactionPage />
                  ) : (
                    <Page404 />
                  )
                }
              />
              <Route
                path="/upload-transactions"
                element={
                  auth?.type === "individual" ? (
                    <UploadTransactionPage />
                  ) : (
                    <Page404 />
                  )
                }
              />
              <Route
                path="/categories"
                element={
                  auth?.type === "individual" ? <CategoryPage /> : <Page404 />
                }
              />

              {/* Firm-only routes */}
              <Route
                path="/heads"
                element={auth?.type === "firm" ? <HeadsPage /> : <Page404 />}
              />
              <Route
                path="/entry-sets"
                element={
                  auth?.type === "firm" ? <EntrySetsPage /> : <Page404 />
                }
              />
              <Route
                path="/summary"
                element={auth?.type === "firm" ? <SummaryPage /> : <Page404 />}
              />
              <Route
                path="/upload-heads"
                element={
                  auth?.type === "firm" ? <UploadHeadsPage /> : <Page404 />
                }
              />
              <Route
                path="/new-entry-set"
                element={
                  auth?.type === "firm" ? <NewEntrySetPage /> : <Page404 />
                }
              />
              <Route
                path="/view-entry-set"
                element={
                  auth?.type === "firm" ? <ViewEntrySetPage /> : <Page404 />
                }
              />
              <Route
                path="/edit-entry-set"
                element={
                  auth?.type === "firm" ? <EditEntrySetPage /> : <Page404 />
                }
              />
            </Route>
          </Route>

          {/* Invalid Paths */}
          <Route path="*" element={<Page404 />} />
        </Routes>

        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
