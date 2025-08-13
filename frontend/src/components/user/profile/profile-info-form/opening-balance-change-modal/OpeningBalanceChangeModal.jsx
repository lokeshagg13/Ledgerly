import { Modal, Button } from "react-bootstrap";
import { formatAmountForDisplay } from "../../../../../utils/formatUtils";

function OpeningBalanceChangeModal({
  show,
  onClose,
  onConfirm,
  prevBalance,
  prevType,
  newBalance,
  newType,
}) {
  const formatBalanceDisplay = (amount, type) => {
    const label = type === "debit" ? "Dr" : "Cr";
    const isZero = amount === "0";
    return `${formatAmountForDisplay(amount)} ${
      isZero ? "" : "(" + label + ")"
    }`;
  };

  return (
    <Modal className="opening-balance-change-modal" show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Opening Balance Change</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You are about to update your opening balance.</p>
        <div className="balance-change-summary">
          <span className="old-balance">
            {formatBalanceDisplay(prevBalance, prevType)}
          </span>
          <span className="balance-arrow mx-2">→</span>
          <span className="new-balance">
            {formatBalanceDisplay(newBalance, newType)}
          </span>
        </div>
        <div className="warning-message">
          Going forward, all balances will be recalculated based on the new
          opening balance.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OpeningBalanceChangeModal;
