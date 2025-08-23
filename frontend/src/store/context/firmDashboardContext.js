import { createContext, useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";

const FirmDashboardContext = createContext({
    isLoadingOverallBalance: false,
    overallBalance: {
        amount: 0,
        latestEntryDate: null,
    },
    overallBalanceError: "",
    fetchOverallBalance: async () => { }
});

export function FirmDashboardContextProvider({ children }) {
    const [isLoadingOverallBalance, setIsLoadingOverallBalance] = useState(false);
    const [overallBalance, setOverallBalance] = useState({
        amount: 0,
        latestEntryDate: null
    });
    const [overallBalanceError, setOverallBalanceError] = useState("");

    function resetErrorFetchingOverallBalance() {
        setOverallBalanceError("");
    }

    function handleErrorFetchingOverallBalance(error) {
        if (!error?.response) {
            setOverallBalanceError(
                "Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly."
            );
        } else if (error?.response?.data?.error) {
            setOverallBalanceError(
                `Apologies for the inconvenience. There was an error while fetching your overall balance. ${error?.response?.data?.error}`
            );
        } else {
            setOverallBalanceError(
                "Apologies for the inconvenience. There was some error while fetching your overall balance. Please try again after some time."
            );
        }
    }

    async function fetchOverallBalance() {
        setIsLoadingOverallBalance(true);
        resetErrorFetchingOverallBalance();
        try {
            const res = await axiosPrivate.get("/user/dashboard/firm/overallBalance");
            const { balance, latestEntryDate } = res?.data;
            setOverallBalance({
                amount: balance,
                latestEntryDate
            });
        } catch (error) {
            handleErrorFetchingOverallBalance(error);
        } finally {
            setIsLoadingOverallBalance(false);
        }
    }

    useEffect(() => {
        fetchOverallBalance();
    }, []);

    const currentValue = {
        isLoadingOverallBalance,
        overallBalance,
        overallBalanceError,
        fetchOverallBalance,
    };

    return (
        <FirmDashboardContext.Provider
            value={currentValue}
        >
            {children}
        </FirmDashboardContext.Provider>
    );
}

export default FirmDashboardContext;
