import { useContext, useEffect } from "react";
import {
  formatAmountForDisplay,
  formatDateForDisplay,
} from "../../../../../utils/formatUtils";
import BalanceFilterSection from "./balance-filter-section/BalanceFilterSection";
import FilterCardNameEditor from "./filter-card-name-editor/FilterCardNameEditor";
import CategoryContext from "../../../../../store/context/categoryContext";
import DashboardContext from "../../../../../store/context/dashboardContext";
import BalanceCardSkeleton from "../../../../ui/skeletons/BalanceCardSkeleton";

function FilteredBalanceCard() {
  const { categories } = useContext(CategoryContext);
  const {
    isLoadingFilteredBalance,
    filteredBalance,
    filteredBalanceError,
    appliedFilters,
    handleResetErrorFetchingFilteredBalance,
    fetchFilteredBalanceAndFilters,
  } = useContext(DashboardContext);

  useEffect(() => {
    handleResetErrorFetchingFilteredBalance();
    fetchFilteredBalanceAndFilters();
    // eslint-disable-next-line
  }, []);

  const getCategoryNames = (categoryIds) => {
    if (
      !Array.isArray(categories) ||
      categories.length === 0 ||
      !Array.isArray(categoryIds) ||
      categoryIds.length === 0
    )
      return null;
    return categoryIds
      .map((id) => categories.find((cat) => cat._id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const renderFiltersSummary = () => {
    const parts = [];
    const { uptoDate, selectedCategories } = appliedFilters;

    if (uptoDate) parts.push(`Upto date: ${formatDateForDisplay(uptoDate)}`);
    else if (filteredBalance.latestTxnDate)
      parts.push(
        `Latest transaction: ${formatDateForDisplay(
          filteredBalance.latestTxnDate
        )}`
      );

    if (selectedCategories) {
      const categoryNames = getCategoryNames(selectedCategories);
      if (categoryNames) parts.push(`Categories: ${categoryNames}`);
    }
    return parts.join("\n");
  };

  const filterSummary = renderFiltersSummary();
  const balanceAmt = filteredBalance.amount;

  return (
    <div className="dashboard-card balance-card filtered">
      <div className="balance-header">
        <FilterCardNameEditor />
        <BalanceFilterSection />
      </div>

      {isLoadingFilteredBalance ? (
        <BalanceCardSkeleton />
      ) : filteredBalanceError ? (
        <div className="text-danger">{filteredBalanceError}</div>
      ) : (
        <>
          <h4
            className={`balance-amount ${
              balanceAmt > 0 ? "positive" : "negative"
            }`}
          >
            {formatAmountForDisplay(Math.abs(balanceAmt))}
            <span className="balance-type">
              {balanceAmt > 0 ? " (CR)" : balanceAmt < 0 ? " (DR)" : ""}
            </span>
          </h4>
          <div className="balance-meta">
            {filterSummary && (
              <div className="filters-applied">
                {filterSummary.split("\n").map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            )}
            {!appliedFilters.uptoDate &&
              (!Array.isArray(appliedFilters.selectedCategories) ||
                appliedFilters.selectedCategories.length === 0) && (
                <div className="filters-applied">No filters applied yet.</div>
              )}
          </div>
        </>
      )}
    </div>
  );
}

export default FilteredBalanceCard;
