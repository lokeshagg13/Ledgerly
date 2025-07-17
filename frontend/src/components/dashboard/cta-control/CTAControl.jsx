import DownloadIcon from "../../ui/icons/DownloadIcon";
import FileIcon from "../../ui/icons/FileIcon";
import GearIcon from "../../ui/icons/GearIcon";

function CTAControl({ onViewTransactions, onSavePDF, onManageCategories }) {
  return (
    <div className="cta-container">
      <button className="cta-button" onClick={onViewTransactions}>
        <span className="cta-icon"><FileIcon /></span>
        <span className="cta-label">View Your Transactions</span>
      </button>
      <button className="cta-button" onClick={onSavePDF}>
        <span className="cta-icon"><DownloadIcon /></span>
        <span className="cta-label">Save Transactions as PDF</span>
      </button>
      <button className="cta-button" onClick={onManageCategories}>
        <span className="cta-icon"><GearIcon /></span>
        <span className="cta-label">Manage Categories</span>
      </button>
    </div>
  );
}

export default CTAControl;
