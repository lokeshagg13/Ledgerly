import { useContext, useEffect, useMemo } from "react";

import FirmDashboardContext from "../../../../../../../store/context/firmDashboardContext";
import NewEntrySetContext from "../../../../../../../store/context/newEntrySetContext";
import { formatAmountForDisplay } from "../../../../../../../utils/formatUtils";

function NewEntrySetTableFooter() {
  const { entrySetDataRows, entrySetBalance, setEntrySetBalance } =
    useContext(NewEntrySetContext);
  const { isLoadingOverallBalance, overallBalance } =
    useContext(FirmDashboardContext);

  useEffect(() => {
    setEntrySetBalance(overallBalance.amount);
  }, []);

  const totalCredit = useMemo(
    () =>
      entrySetDataRows.reduce(
        (sum, row) => sum + (parseFloat(row.credit) || 0),
        0
      ),
    [entrySetDataRows]
  );
  const totalDebit = useMemo(
    () =>
      entrySetDataRows.reduce(
        (sum, row) => sum + (parseFloat(row.debit) || 0),
        0
      ),
    [entrySetDataRows]
  );

  useEffect(() => {
    let adjustedCredit = totalCredit;
    let adjustedDebit = totalDebit;
    const cashRow = entrySetDataRows.find((row) => row.head === "CASH");
    if (cashRow) {
      const cashCredit = parseFloat(cashRow.credit) || 0;
      const cashDebit = parseFloat(cashRow.debit) || 0;
      if (cashCredit > 0) {
        adjustedCredit -= cashCredit;
      } else if (cashDebit > 0) {
        adjustedDebit -= cashDebit;
      }
    }
    setEntrySetBalance(overallBalance.amount + adjustedCredit - adjustedDebit);
  }, [totalCredit, totalDebit]);

  return (
    <tfoot>
      <tr className="table-warning footer-row">
        <td></td>
        <td></td>
        <td>
          {isLoadingOverallBalance ? (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <strong>Balance: {formatAmountForDisplay(entrySetBalance)}</strong>
          )}
        </td>
        <td>
          <strong>{formatAmountForDisplay(totalCredit)}</strong>
        </td>
        <td>
          <strong>{formatAmountForDisplay(totalDebit)}</strong>
        </td>
      </tr>
    </tfoot>
  );
}

export default NewEntrySetTableFooter;
