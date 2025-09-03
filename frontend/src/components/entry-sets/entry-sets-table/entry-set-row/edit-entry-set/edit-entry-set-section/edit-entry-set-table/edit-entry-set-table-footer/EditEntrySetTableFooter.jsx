import { useContext, useEffect, useMemo } from "react";

import EditEntrySetContext from "../../../../../../../../store/context/editEntrySetContext";
import { formatAmountForDisplay } from "../../../../../../../../utils/formatUtils";

function EditEntrySetTableFooter() {
  const {
    editableEntrySetDataRows,
    editableEntrySetBalance,
    entrySetOpeningBalance,
    setEditableEntrySetBalance,
  } = useContext(EditEntrySetContext);

  const totalCredit = useMemo(
    () =>
      editableEntrySetDataRows.reduce(
        (sum, row) => sum + (parseFloat(row.credit) || 0),
        0
      ),
    [editableEntrySetDataRows]
  );
  const totalDebit = useMemo(
    () =>
      editableEntrySetDataRows.reduce(
        (sum, row) => sum + (parseFloat(row.debit) || 0),
        0
      ),
    [editableEntrySetDataRows]
  );

  useEffect(() => {
    let adjustedCredit = totalCredit;
    let adjustedDebit = totalDebit;
    const cashRow = editableEntrySetDataRows.find(
      (row) => row.headName === "CASH"
    );
    if (cashRow) {
      const cashCredit = parseFloat(cashRow.credit) || 0;
      const cashDebit = parseFloat(cashRow.debit) || 0;
      if (cashCredit > 0) {
        adjustedCredit -= cashCredit;
      } else if (cashDebit > 0) {
        adjustedDebit -= cashDebit;
      }
    }
    setEditableEntrySetBalance(
      entrySetOpeningBalance + adjustedCredit - adjustedDebit
    );
  }, [
    entrySetOpeningBalance,
    editableEntrySetDataRows,
    setEditableEntrySetBalance,
    totalCredit,
    totalDebit,
  ]);

  return (
    <tfoot>
      <tr className="table-warning footer-row">
        <td></td>
        <td></td>
        <td>
          <strong>
            Balance: {formatAmountForDisplay(editableEntrySetBalance)}
          </strong>
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

export default EditEntrySetTableFooter;
