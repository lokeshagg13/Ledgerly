import { useLocation, useNavigate } from "react-router-dom";

function useAppNavigate() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigateToPath = (path, { replace } = {}) => {
        if (replace) {
            navigate(path, { replace: true });
        } else {
            navigate(path, {
                state: { from: location.pathname },
            });
        }
    };

    const handleNavigateBack = (defaultPath = "/dashboard") => {
        const previousPage = location.state?.from || defaultPath;
        navigate(previousPage);
    };

    return {
        location,
        handleNavigateToPath,
        handleNavigateBack,
    }
}

export default useAppNavigate;