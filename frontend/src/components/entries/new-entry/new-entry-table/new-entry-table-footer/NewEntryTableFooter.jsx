import { useContext, useMemo } from "react";

import NewEntryContext from "../../../../../store/context/newEntryContext";
import { formatAmountForDisplay } from "../../../../../utils/formatUtils";

function NewEntryTableFooter() {
  const { entryDataRows } = useContext(NewEntryContext);

  const totalDebit = useMemo(
    () =>
      entryDataRows.reduce((sum, row) => sum + (parseFloat(row.debit) || 0), 0),
    [entryDataRows]
  );
  const totalCredit = useMemo(
    () =>
      entryDataRows.reduce(
        (sum, row) => sum + (parseFloat(row.credit) || 0),
        0
      ),
    [entryDataRows]
  );
  const balance = totalDebit - totalCredit;

  return (
    <tfoot>
      <tr className="table-warning footer-row">
        <td></td>
        <td></td>
        <td>
          <strong>Balance: {formatAmountForDisplay(balance)}</strong>
        </td>
        <td>
          <strong>{formatAmountForDisplay(totalDebit)}</strong>
        </td>
        <td>
          <strong>{formatAmountForDisplay(totalCredit)}</strong>
        </td>
      </tr>
    </tfoot>
  );
}

export default NewEntryTableFooter;
