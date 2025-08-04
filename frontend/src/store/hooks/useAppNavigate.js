import { useContext } from "react";

import NavContext from "../context/navContext";

// Simple hook (custom) to use nav context
function useAppNavigate() {
    return useContext(NavContext);
}

export default useAppNavigate;