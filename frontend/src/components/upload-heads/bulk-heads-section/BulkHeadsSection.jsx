import { useContext, useEffect } from "react";

import HeadsUploadContext from "../../../store/context/headsUploadContext";
import BulkHeadsTable from "./bulk-heads-table/BulkHeadsTable";
import BulkHeadsFooterControl from "./bulk-heads-footer-control/BulkHeadsFooterControl";
import BulkHeadsTopControl from "./bulk-heads-top-control/BulkHeadsTopControl";

function BulkHeadsSection() {
  const {
    extractedHeads,
    isEditHeadSectionVisible,
    errorUploadingHeads,
    handleResetErrorUploadingHeads,
  } = useContext(HeadsUploadContext);

  useEffect(() => {
    if (errorUploadingHeads) {
      const timeout = setTimeout(() => {
        handleResetErrorUploadingHeads();
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [errorUploadingHeads, handleResetErrorUploadingHeads]);

  if (!isEditHeadSectionVisible || extractedHeads?.length === 0) return null;

  return (
    <div className="bulk-heads-section">
      <div className="bulk-heads-header">
        <h3>Edit Heads</h3>
      </div>
      <BulkHeadsTopControl />
      <BulkHeadsTable />
      {errorUploadingHeads && (
        <div className="error-message" role="alert" aria-live="polite">
          {errorUploadingHeads}
        </div>
      )}
      <BulkHeadsFooterControl />
    </div>
  );
}

export default BulkHeadsSection;
