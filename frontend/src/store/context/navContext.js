import { createContext, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const NavContext = createContext({
    location: null,
    handleNavigateToPath: (path, { replace }) => { },
    handleNavigateBack: () => { }
});

export function NavProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();

    const navStackRef = useRef([]);

    useEffect(() => {
        const current = location.pathname;
        const last = navStackRef.current[navStackRef.current.length - 1];
        if (current !== last) {
            navStackRef.current.push(current);
        }
    }, [location.pathname]);

    const handleNavigateToPath = (path, { replace } = {}) => {
        if (replace) {
            navigate(path, { replace: true });
        } else {
            navigate(path);
        }
    };

    const handleNavigateBack = () => {
        navStackRef.current.pop();
        const previous = navStackRef.current.pop();

        if (previous) {
            navigate(previous);
        } else {
            navigate(auth?.accessToken ? "/dashboard" : "/home");
        }
    };

    const currentContextValue = { location, handleNavigateToPath, handleNavigateBack };

    return (
        <NavContext.Provider
            value={currentContextValue}
        >
            {children}
        </NavContext.Provider>
    );
}

export default NavContext;