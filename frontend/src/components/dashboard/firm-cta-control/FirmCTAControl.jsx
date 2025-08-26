import useAppNavigate from "../../../store/hooks/useAppNavigate";
import DownloadIcon from "../../ui/icons/DownloadIcon";
import FileIcon from "../../ui/icons/FileIcon";
import GearIcon from "../../ui/icons/GearIcon";

function FirmCTAControl() {
  const { handleNavigateToPath } = useAppNavigate();
  return (
    <div className="dashboard-cta-container">
      <button
        className="cta-button"
        onClick={() => handleNavigateToPath("/entry-sets")}
      >
        <span className="cta-icon">
          <FileIcon />
        </span>
        <span className="cta-label">View Entries</span>
      </button>
      <button
        className="cta-button"
        onClick={() => handleNavigateToPath("/summary")}
      >
        <span className="cta-icon">
          <DownloadIcon />
        </span>
        <span className="cta-label">View Summary</span>
      </button>
      <button
        className="cta-button"
        onClick={() => handleNavigateToPath("/heads")}
      >
        <span className="cta-icon">
          <GearIcon />
        </span>
        <span className="cta-label">Manage Heads</span>
      </button>
    </div>
  );
}

export default FirmCTAControl;
