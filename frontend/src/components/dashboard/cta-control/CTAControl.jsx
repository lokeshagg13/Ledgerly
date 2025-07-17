import { useLocation, useNavigate } from "react-router-dom";

import DownloadIcon from "../../ui/icons/DownloadIcon";
import FileIcon from "../../ui/icons/FileIcon";
import GearIcon from "../../ui/icons/GearIcon";

function CTAControl() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleViewTransactions = () =>
    navigate("/transactions", {
      state: { from: location.pathname },
    });

  const handlePrintTransactions = () =>
    navigate("/transactions/print", {
      state: { from: location.pathname },
    });

  const handleManageCategories = () =>
    navigate("/categories", {
      state: { from: location.pathname },
    });

  return (
    <div className="cta-container">
      <button className="cta-button" onClick={handleViewTransactions}>
        <span className="cta-icon">
          <FileIcon />
        </span>
        <span className="cta-label">View Your Transactions</span>
      </button>
      <button className="cta-button" onClick={handlePrintTransactions}>
        <span className="cta-icon">
          <DownloadIcon />
        </span>
        <span className="cta-label">Save Transactions as PDF</span>
      </button>
      <button className="cta-button" onClick={handleManageCategories}>
        <span className="cta-icon">
          <GearIcon />
        </span>
        <span className="cta-label">Manage Categories</span>
      </button>
    </div>
  );
}

export default CTAControl;
