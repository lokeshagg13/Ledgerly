import { useContext, useMemo } from "react";

import NewEntryContext from "../../../../../store/context/newEntryContext";
import { formatAmountForDisplay } from "../../../../../utils/formatUtils";
import FirmDashboardContext from "../../../../../store/context/firmDashboardContext";

function NewEntryTableFooter() {
  const { entryDataRows } = useContext(NewEntryContext);
  const { isLoadingOverallBalance, overallBalance } =
    useContext(FirmDashboardContext);

  const totalCredit = useMemo(
    () =>
      entryDataRows.reduce(
        (sum, row) => sum + (parseFloat(row.credit) || 0),
        0
      ),
    [entryDataRows]
  );
  const totalDebit = useMemo(
    () =>
      entryDataRows.reduce((sum, row) => sum + (parseFloat(row.debit) || 0), 0),
    [entryDataRows]
  );

  let adjustedCredit = totalCredit;
  let adjustedDebit = totalDebit;
  const cashRow = entryDataRows.find((row) => row.head === "CASH");
  if (cashRow) {
    const cashCredit = parseFloat(cashRow.credit) || 0;
    const cashDebit = parseFloat(cashRow.debit) || 0;
    if (cashCredit > 0) {
      adjustedCredit -= cashCredit;
    } else if (cashDebit > 0) {
      adjustedDebit -= cashDebit;
    }
  }

  const balance = overallBalance.amount + adjustedCredit - adjustedDebit;

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
            <strong>Balance: {formatAmountForDisplay(balance)}</strong>
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

export default NewEntryTableFooter;
