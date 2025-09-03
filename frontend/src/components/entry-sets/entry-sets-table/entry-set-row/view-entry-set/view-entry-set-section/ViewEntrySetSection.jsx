import { useContext } from "react";
import { Spinner } from "react-bootstrap";

import ViewEntrySetHeader from "./view-entry-set-header/ViewEntrySetHeader";
import ViewEntrySetControl from "./view-entry-set-control/ViewEntrySetControl";
import ViewEntrySetTable from "./view-entry-set-table/ViewEntrySetTable";
import ViewEntrySetContext from "../../../../../../store/context/viewEntrySetContext";
import ErrorImage from "../../../../../../images/chart-error.png";

function ViewEntrySetSection() {
  const { isLoadingEntrySetDetails, errorFetchingEntrySetDetails } =
    useContext(ViewEntrySetContext);

  if (isLoadingEntrySetDetails) {
    return (
      <div className="entry-set-loading">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (errorFetchingEntrySetDetails) {
    return (
      <div className="error-section entry-set-error">
        <img src={ErrorImage} alt="" width={150} height="auto" />
        <p className="error-message">{errorFetchingEntrySetDetails}</p>
      </div>
    );
  }

  return (
    <>
      <ViewEntrySetControl />
      <ViewEntrySetHeader />
      <ViewEntrySetTable />
    </>
  );
}

export default ViewEntrySetSection;
