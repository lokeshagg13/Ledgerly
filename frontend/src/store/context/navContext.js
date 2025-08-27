import { createContext, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const NavContext = createContext({
    location: null,
    handleNavigateToPath: (path, options) => { },
    handleNavigateBack: () => { }
});

export function NavProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();

    const navStackRef = useRef([]);

    useEffect(() => {
        const current = {
            path: location.pathname,
            state: location.state || null
        };
        const last = navStackRef.current[navStackRef.current.length - 1];

        // Push only if it's a new path or state changed
        if (!last || last.path !== current.path || last.state !== current.state) {
            navStackRef.current.push(current);
        }
    }, [location.pathname, location.state]);

    const handleNavigateToPath = (path, { replace = false, state = undefined } = {}) => {
        if (replace) {
            navigate(path, { replace: true, state });
        } else {
            navigate(path, { state });
        }
    };

    const handleNavigateBack = () => {
        navStackRef.current.pop();
        const previous = navStackRef.current.pop();

        if (previous) {
            navigate(previous.path, { state: previous.state });
        } else {
            navigate(auth?.accessToken ? "/dashboard" : "/home");
        }
    };

    const currentContextValue = {
        location,
        handleNavigateToPath,
        handleNavigateBack
    };

    return (
        <NavContext.Provider value={currentContextValue}>
            {children}
        </NavContext.Provider>
    );
}

export default NavContext;