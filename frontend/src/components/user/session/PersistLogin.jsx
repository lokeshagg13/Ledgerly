import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import useAuth from "../../../store/hooks/useAuth";
import useRefreshToken from "../../../store/hooks/useRefreshToken";
import PageSkeleton from "../../ui/skeletons/PageSkeleton";

// Persist login component to continue a session even on refresh page or expiry of access token until refresh token is not expired
function PersistLogin() {
  const refresh = useRefreshToken();
  const { auth, authLoading, setAuthLoading } = useAuth();
  // Whenever this component is loaded, accessToken is checked. If no accessToken exist, then verifyRefreshToken is called to create a new accessToken using refresh hook (refresh token further) and set is loading to false
  useEffect(() => {
    const verifyRefreshToken = async () => {
      setAuthLoading(true);
      try {
        await refresh();
      } catch (error) {
        console.log("Error while refreshing the login:", error);
      } finally {
        setAuthLoading(false);
      }
    };
    !auth?.accessToken ? verifyRefreshToken() : setAuthLoading(false);
    // eslint-disable-next-line
  }, []);

  // Finally, either show the loader icon or the contained route according to the path (We can see app.jsx for understanding usage of Outlet)
  return <>{authLoading ? <PageSkeleton /> : <Outlet />}</>;
}

export default PersistLogin;
