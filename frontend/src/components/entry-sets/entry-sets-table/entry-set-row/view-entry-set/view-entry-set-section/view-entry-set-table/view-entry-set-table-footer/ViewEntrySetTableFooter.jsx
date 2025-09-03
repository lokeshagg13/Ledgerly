import { useContext, useMemo } from "react";

import ViewEntrySetContext from "../../../../../../../../store/context/viewEntrySetContext";
import { formatAmountForDisplay } from "../../../../../../../../utils/formatUtils";

function ViewEntrySetTableFooter() {
  const { entrySetDataRows, entrySetBalance } = useContext(ViewEntrySetContext);

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

  return (
    <tfoot>
      <tr className="table-warning footer-row">
        <td></td>
        <td></td>
        <td>
          <strong>Balance: {formatAmountForDisplay(entrySetBalance)}</strong>
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

export default ViewEntrySetTableFooter;
