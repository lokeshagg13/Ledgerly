import { useContext } from "react";
import { Form } from "react-bootstrap";

import { formatAmountForDisplay } from "../../../../utils/formatUtils";
import SummaryContext from "../../../../store/context/summaryContext";

function SummaryRow({ rowId, rowData }) {
  const { headName, calculatedBalance } = rowData;
  const { selectedSummaryRows, handleToggleSummaryRowSelection } =
    useContext(SummaryContext);

  return (
    <tr>
      <td>
        <Form.Check
          type="checkbox"
          className="summary-row-checkbox"
          id={`summary-row-checkbox-${rowId}`}
          checked={selectedSummaryRows.includes(rowId)}
          onChange={() => handleToggleSummaryRowSelection(rowId)}
          aria-label={`Select row for head ${headName}`}
        />
      </td>
      <td>{headName}</td>
      <td>
        {formatAmountForDisplay(
          calculatedBalance < 0 ? Math.abs(calculatedBalance) : 0
        )}
      </td>
      <td>
        {formatAmountForDisplay(calculatedBalance > 0 ? calculatedBalance : 0)}
      </td>
    </tr>
  );
}

export default SummaryRow;
