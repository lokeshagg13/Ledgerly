import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import HeadsContext from "../../../store/context/headsContext";
import AddHeadModal from "../heads-modals/AddHeadModal";
import useAppNavigate from "../../../store/hooks/useAppNavigate";
import CancelIcon from "../../ui/icons/CancelIcon";

function HeadsMainControl() {
  const { handleNavigateToPath } = useAppNavigate();
  const {
    heads,
    isLoadingHeads,
    isAddHeadModalVisible,
    setFilteredHeads,
    handleOpenAddHeadModal,
    fetchHeadsFromDB,
  } = useContext(HeadsContext);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!heads || heads.length === 0) {
      setFilteredHeads([]);
      return;
    }

    const cleaned = searchValue.replace(/[^a-z0-9]/gi, "");
    if (cleaned === "") {
      setFilteredHeads(heads);
      return;
    }

    const regex = new RegExp("^" + cleaned, "i");
    const matches = heads.filter((h) =>
      regex.test(h.name.replace(/[^a-z0-9]/gi, ""))
    );
    setFilteredHeads(matches);
  }, [searchValue, heads, setFilteredHeads]);

  return (
    <div className="heads-main-control">
      <div className="heads-main-control-row">
        {heads.length > 0 && (
          <div className="search-box-container">
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search Heads"
              />
              {searchValue && (
                <div className="search-clear-icon" onClick={() => setSearchValue("")}>
                  <CancelIcon />
                </div>
              )}
            </div>
          </div>
        )}
        <Button
          type="button"
          className="control-btn btn-blue"
          aria-label="Add a new head"
          onClick={handleOpenAddHeadModal}
          disabled={isLoadingHeads}
        >
          Add New Head
        </Button>
        <Button
          type="button"
          className="control-btn btn-outline-light"
          aria-label="Upload bulk heads"
          onClick={() => handleNavigateToPath("/heads/upload")}
          disabled={isLoadingHeads}
        >
          Upload Heads
        </Button>
        <Button
          type="button"
          className="control-btn btn-outline-light"
          aria-label="Reload heads"
          onClick={() => fetchHeadsFromDB(true)}
          disabled={isLoadingHeads}
          title="Click to reload heads"
        >
          {isLoadingHeads ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Refreshing...
            </>
          ) : (
            "Refresh Heads"
          )}
        </Button>
      </div>
      {isAddHeadModalVisible && <AddHeadModal />}
    </div>
  );
}

export default HeadsMainControl;
