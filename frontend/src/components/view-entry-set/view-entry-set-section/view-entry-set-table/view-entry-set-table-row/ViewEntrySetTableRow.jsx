import { formatAmountWithCommas } from "../../../../../utils/formatUtils";

function ViewEntrySetTableRow({ data }) {
  const { id, sno, type, head, debit, credit } = data;

  return (
    <tr key={id}>
      <td>{sno}</td>
      <td>
        <div className="view-entry-set-table-row-field type-field">
          {type === "credit" ? "C" : "D"}
        </div>
      </td>
      <td>
        <div className="view-entry-set-table-row-field head-field">{head}</div>
      </td>
      <td>
        <div className="view-entry-set-table-row-field credit-field">
          {credit ? formatAmountWithCommas(credit) : "-"}
        </div>
      </td>
      <td>
        <div className="view-entry-set-table-row-field debit-field">
          {debit ? formatAmountWithCommas(debit) : "-"}
        </div>
      </td>
    </tr>
  );
}

export default ViewEntrySetTableRow;
