import { useContext } from "react";

import AuthContext from "../context/authContext";

// Simple hook (custom) to use auth context
function useAuth() {
    return useContext(AuthContext);
}

export default useAuth;