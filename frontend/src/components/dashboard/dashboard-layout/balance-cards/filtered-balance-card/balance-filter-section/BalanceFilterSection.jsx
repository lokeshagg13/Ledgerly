import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import Popover from "@mui/material/Popover";

import FunnelIcon from "../../../../../ui/icons/FunnelIcon";
import DateFilterInput from "./filter-inputs/DateFilterInput";
import CategoryFilterInput from "./filter-inputs/CategoryFilterInput";
import DashboardContext from "../../../../../../store/context/dashboardContext";

function BalanceFilterSection() {
  const [isFilterPopoverVisible, setIsFilterPopoverVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    isUpdatingFilters,
    updateFilterError,
    resetErrorUpdatingBalanceFilters,
    resetFilterFormData,
    fetchFilteredBalanceAndFilters,
    updateBalanceFilters,
  } = useContext(DashboardContext);

  const handleOpenFilterPopover = (e) => {
    resetFilterFormData();
    setAnchorEl(e.target);
    setIsFilterPopoverVisible(true);
  };

  const handleCloseFilterPopover = () => {
    resetErrorUpdatingBalanceFilters();
    setAnchorEl(null);
    setIsFilterPopoverVisible(false);
  };

  const handleToggleFilterPopover = (e) => {
    isFilterPopoverVisible
      ? handleCloseFilterPopover()
      : handleOpenFilterPopover(e);
  };

  const handleApplyFilters = async () => {
    const isError = await updateBalanceFilters();
    if (isError) return;
    await fetchFilteredBalanceAndFilters();
    handleCloseFilterPopover();
  };

  return (
    <>
      <button
        type="button"
        className="filter-button"
        onClick={handleToggleFilterPopover}
        aria-describedby="balanceFilter"
        aria-label="Filter Balance"
      >
        <FunnelIcon />
      </button>

      <Popover
        id="balanceFilter"
        className="balance-filter-popover"
        open={isFilterPopoverVisible}
        anchorEl={anchorEl}
        onClose={handleCloseFilterPopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div className="balance-filter-popover-inner">
          <DateFilterInput />
          <CategoryFilterInput />
          {updateFilterError.message && (
            <div className="balance-filter-error">
              {updateFilterError.message}
            </div>
          )}
          <div className="balance-filter-control">
            <Button
              variant="primary"
              onClick={handleApplyFilters}
              size="sm"
              disabled={isUpdatingFilters}
            >
              {isUpdatingFilters ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Updating...
                </>
              ) : (
                "Update Filters"
              )}
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleCloseFilterPopover}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
}

export default BalanceFilterSection;
