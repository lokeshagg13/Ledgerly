import useAppNavigate from "../../../store/hooks/useAppNavigate";
import DownloadIcon from "../../ui/icons/DownloadIcon";
import FileIcon from "../../ui/icons/FileIcon";
import GearIcon from "../../ui/icons/GearIcon";

function IndividualCTAControl() {
  const { handleNavigateToPath } = useAppNavigate();
  return (
    <div className="dashboard-cta-container">
      <button
        className="cta-button"
        onClick={() => handleNavigateToPath("/transactions")}
      >
        <span className="cta-icon">
          <FileIcon />
        </span>
        <span className="cta-label">View Your Transactions</span>
      </button>
      <button
        className="cta-button"
        onClick={() => handleNavigateToPath("/print-transactions")}
      >
        <span className="cta-icon">
          <DownloadIcon />
        </span>
        <span className="cta-label">Save Transactions as PDF</span>
      </button>
      <button
        className="cta-button"
        onClick={() => handleNavigateToPath("/categories")}
      >
        <span className="cta-icon">
          <GearIcon />
        </span>
        <span className="cta-label">Manage Categories</span>
      </button>
    </div>
  );
}

export default IndividualCTAControl;
