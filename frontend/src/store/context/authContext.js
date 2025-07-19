import { createContext, useState } from "react";

const AuthContext = createContext({
    auth: null,
    setAuth: (val) => { },
    authLoading: null,
    setAuthLoading: (val) => { }
});

// Auth Provider is a global state manager (context) that allows to check whether user is logged in or not and set their authentication status from anythere within the AuthProvider wrapped components
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [authLoading, setAuthLoading] = useState(true);

    return (
        <AuthContext.Provider value={{ auth, setAuth, authLoading, setAuthLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;