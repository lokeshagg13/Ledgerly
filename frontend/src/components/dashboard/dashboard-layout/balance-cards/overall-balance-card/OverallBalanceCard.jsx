import { useContext, useEffect } from "react";

import {
  formatAmountForDisplay,
  formatDateForDisplay,
} from "../../../../../utils/formatUtils";
import DashboardContext from "../../../../../store/context/dashboardContext";

function OverallBalanceCard() {
  const {
    isLoadingOverallBalance,
    overallBalance,
    overallBalanceError,
    fetchOverallBalance,
  } = useContext(DashboardContext);

  useEffect(() => {
    fetchOverallBalance();
    // eslint-disable-next-line
  }, []);

  const balanceAmt = overallBalance.amount;

  return (
    <div className="dashboard-card balance-card overall">
      <h6 className="balance-title">Net Balance</h6>

      {isLoadingOverallBalance ? (
        <>Loading...</>
      ) : overallBalanceError ? (
        <div className="text-danger">{overallBalanceError}</div>
      ) : (
        <>
          <h4
            className={`balance-amount ${
              balanceAmt > 0 ? "positive" : "negative"
            }`}
          >
            {formatAmountForDisplay(Math.abs(balanceAmt))}{" "}
            <span className="balance-type">
              ({balanceAmt >= 0 ? "CR" : "DR"})
            </span>
          </h4>
          <h6 className="balance-date">
            Upto Date:{" "}
            {formatDateForDisplay(overallBalance.latestTxnDate, "-", true)}
          </h6>
        </>
      )}
    </div>
  );
}

export default OverallBalanceCard;
