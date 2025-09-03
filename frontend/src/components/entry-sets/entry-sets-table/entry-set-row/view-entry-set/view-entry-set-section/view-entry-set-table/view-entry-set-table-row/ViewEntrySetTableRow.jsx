import { formatAmountForDisplay } from "../../../../../../../../utils/formatUtils";

function ViewEntrySetTableRow({ data }) {
  const { id, sno, type, headName, debit, credit } = data;

  return (
    <tr key={id}>
      <td>{sno}</td>
      <td>
        <div className="view-entry-set-table-row-field type-field">{type}</div>
      </td>
      <td>
        <div className="view-entry-set-table-row-field head-field">
          {headName}
        </div>
      </td>
      <td>
        <div className="view-entry-set-table-row-field credit-field">
          {credit ? (
            formatAmountForDisplay(credit)
          ) : (
            <div className="no-amt"></div>
          )}
        </div>
      </td>
      <td>
        <div className="view-entry-set-table-row-field debit-field">
          {debit ? (
            formatAmountForDisplay(debit)
          ) : (
            <div className="no-amt"></div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default ViewEntrySetTableRow;
