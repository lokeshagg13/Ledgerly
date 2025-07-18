import { OverlayTrigger, Tooltip } from "react-bootstrap";
import QuestionIcon from "../../../../ui/icons/QuestionIcon";

function OpeningBalanceTooltip() {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="balInfoTooltip" className="custom-tooltip">
          <div className="tooltip-title">Opening Balance Info</div>
          <div className="tooltip-description">
            This is the balance you’re starting with. <br />
            <span>Your total balance =</span>
            <strong> Opening Balance + all your transactions.</strong>
          </div>
          <div className="tooltip-types">
            <span className="cr-label">CR</span> → Positive balance <br />
            <span className="dr-label">DR</span> → Negative balance
          </div>
        </Tooltip>
      }
    >
      <span className="opening-balance-info-icon" aria-label="Info" role="img">
        <QuestionIcon fill="#1e88e5" width="1.1rem" height="1.2rem" />
      </span>
    </OverlayTrigger>
  );
}

export default OpeningBalanceTooltip;
