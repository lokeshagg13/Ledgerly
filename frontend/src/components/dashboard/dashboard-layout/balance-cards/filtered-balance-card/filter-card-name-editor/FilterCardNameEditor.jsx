import { useEffect, useRef, useState } from "react";
import EditIcon from "../../../../../ui/icons/EditIcon";
import CheckIcon from "../../../../../ui/icons/CheckIcon";
import CancelIcon from "../../../../../ui/icons/CancelIcon";
import { axiosPrivate } from "../../../../../../api/axios";

function FilterCardNameEditor() {
  const filterNameRef = useRef();
  const [isFilterCardNameEditorVisible, setIsFilterCardNameEditorVisible] =
    useState(false);
  const [filterCardName, setFilterCardName] = useState("");
  const [filterCardTempName, setFilterCardTempName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleOpenFilterCardNameEditor = () => {
    setFilterCardTempName(filterCardName);
    setIsFilterCardNameEditorVisible(true);
  };

  const handleCloseFilterCardNameEditor = () => {
    setIsFilterCardNameEditorVisible(false);
    setFilterCardTempName(filterCardName);
    setErrorMessage("");
  };

  const fetchTitle = async () => {
    try {
      const res = await axiosPrivate.get("/user/dashboard/custom/title");
      const title = res?.data?.title?.trim() || "Filtered Balance";
      setFilterCardName(title);
    } catch (error) {
      setErrorMessage("Failed to load title");
    }
  };

  const handleUpdateTitle = async () => {
    const trimmedName = filterCardTempName.trim();
    if (!trimmedName || trimmedName === filterCardName || isUpdating) return;
    try {
      setIsUpdating(true);
      setErrorMessage("");
      await axiosPrivate.put("/user/dashboard/custom/title", {
        title: trimmedName,
      });
      setFilterCardName(trimmedName);
      setIsFilterCardNameEditorVisible(false);
    } catch (error) {
      setErrorMessage(error?.response?.data?.error || "Failed to update title");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchTitle();
  }, []);

  useEffect(() => {
    if (isFilterCardNameEditorVisible) {
      filterNameRef?.current?.focus();
    }
  }, [isFilterCardNameEditorVisible]);

  return (
    <div className="balance-filter filter-card-name-editable">
      {isFilterCardNameEditorVisible ? (
        <div className="filter-card-name-form">
          <div className="filter-card-name-input-wrapper">
            <input
              type="text"
              value={filterCardTempName}
              onChange={(e) => {
                setFilterCardTempName(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              disabled={isUpdating}
              className="filter-card-name-input"
              placeholder="Enter title for this card"
              ref={filterNameRef}
            />
            <div className="filter-card-name-form-controls">
              <button
                onClick={handleUpdateTitle}
                disabled={
                  isUpdating ||
                  filterCardTempName.trim() === "" ||
                  filterCardTempName.trim() === filterCardName.trim()
                }
                className="filter-card-name-btn save-btn"
                title="Save"
              >
                <CheckIcon />
              </button>
              <button
                onClick={handleCloseFilterCardNameEditor}
                disabled={isUpdating}
                className="filter-card-name-btn cancel-btn"
                title="Cancel"
              >
                <CancelIcon />
              </button>
            </div>
          </div>
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}
        </div>
      ) : (
        <div className="filter-card-name-display">
          <h6 className="balance-title">
            {filterCardName || "Filtered Balance"}
          </h6>
          <button
            onClick={handleOpenFilterCardNameEditor}
            className="filter-card-name-btn edit-btn text-info"
            title="Edit title"
          >
            <EditIcon />
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterCardNameEditor;
