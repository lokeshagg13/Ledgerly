import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import Popover from "@mui/material/Popover";

import FunnelIcon from "../../../../../ui/icons/FunnelIcon";
import DateFilterInputs from "./filter-inputs/DateFilterInputs";
import CategoryFilterInput from "./filter-inputs/CategoryFilterInput";
import DashboardContext from "../../../../../../store/context/dashboardContext";

function BalanceFilterSection() {
  const [isFilterPopoverVisible, setIsFilterPopoverVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    filteredBalanceError,
    resetErrorFetchingFilteredBalance,
    resetFilterFormData,
    updateFiltersAndRefetchBalance,
  } = useContext(DashboardContext);

  const handleOpenFilterPopover = (e) => {
    resetFilterFormData();
    setAnchorEl(e.target);
    setIsFilterPopoverVisible(true);
  };

  const handleCloseFilterPopover = () => {
    resetErrorFetchingFilteredBalance();
    setAnchorEl(null);
    setIsFilterPopoverVisible(false);
  };

  const handleToggleFilterPopover = (e) => {
    isFilterPopoverVisible
      ? handleCloseFilterPopover()
      : handleOpenFilterPopover(e);
  };

  const handleApplyFilters = async () => {
    const isSuccess = await updateFiltersAndRefetchBalance();
    if (!isSuccess) return;
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
          <DateFilterInputs />
          <CategoryFilterInput />
          {filteredBalanceError.type === "input" && (
            <div className="balance-filter-error">
              {filteredBalanceError.message}
            </div>
          )}
          <div className="balance-filter-control">
            <Button variant="primary" onClick={handleApplyFilters} size="sm">
              Apply Filters
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
