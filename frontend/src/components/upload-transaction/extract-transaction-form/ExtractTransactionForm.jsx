import { useContext } from "react";

import ExtractTransactionControl from "./extract-transaction-control/ExtractTransactionControl";
import TransactionUploadContext from "../../../store/context/transactionUploadContext";
import ExtractTransactionInput from "./extract-transaction-input/ExtractTransactionInput";

function ExtractTransactionForm() {
  const { extractTransactionError } = useContext(TransactionUploadContext);

  return (
    <div className="extract-transaction-form">
      <ExtractTransactionInput />
      {extractTransactionError && (
        <div className="error-message">{extractTransactionError}</div>
      )}
      <ExtractTransactionControl />
    </div>
  );
}

export default ExtractTransactionForm;
