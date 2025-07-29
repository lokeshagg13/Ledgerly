import { useContext } from "react";

import TransactionUploadContext from "../../../store/context/transactionUploadContext";
import ExtractTransactionInput from "./extract-transaction-input/ExtractTransactionInput";
import ExtractTransactionControl from "./extract-transaction-control/ExtractTransactionControl";
import ExtractTransactionStatus from "./extract-transaction-status/ExtractTransactionStatus";

function ExtractTransactionForm() {
  const { extractTransactionError } = useContext(TransactionUploadContext);

  return (
    <div className="extract-transaction-form">
      <ExtractTransactionInput />
      {extractTransactionError && (
        <div className="error-message">{extractTransactionError}</div>
      )}
      <ExtractTransactionControl />
      <ExtractTransactionStatus />
    </div>
  );
}

export default ExtractTransactionForm;
