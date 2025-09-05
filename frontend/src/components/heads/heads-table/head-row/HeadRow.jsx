import { useContext, useState } from "react";
import { Form } from "react-bootstrap";

import HeadsContext from "../../../../store/context/headsContext";
import HeadRowControl from "./head-row-control/HeadRowControl";
import { formatAmountForDisplay } from "../../../../utils/formatUtils";
import EditHeadModal from "../../heads-modals/EditHeadModal";
import CaretDownIcon from "../../../ui/icons/CaretDownIcon";
import CaretUpIcon from "../../../ui/icons/CaretUpIcon";

function HeadRow({ headId, headData }) {
  const { name, openingBalance } = headData;
  const { selectedHeads, handleToggleHeadSelection } = useContext(HeadsContext);
  const [isEditHeadModalVisible, setIsEditHeadModalVisible] = useState(false);

  const handleOpenEditHeadModal = () => {
    setIsEditHeadModalVisible(true);
  };

  const handleCloseEditHeadModal = () => {
    setIsEditHeadModalVisible(false);
  };

  const amount = openingBalance?.amount ?? 0;
  const isDebit = amount <= 0;
  const displayAmount = formatAmountForDisplay(Math.abs(amount));
  const balanceTypeLabel = isDebit ? "DR" : "CR";

  return (
    <tr>
      <td>
        <Form.Check
          type="checkbox"
          className="head-checkbox"
          id={`head-checkbox-${headId}`}
          checked={selectedHeads.includes(headId)}
          onChange={() => handleToggleHeadSelection(headId)}
          aria-label={`Select head ${name}`}
        />
      </td>
      <td>{name}</td>
      <td>
        <div className="head-row-opening-balance">
          <span className="head-row-opening-balance-amount">
            {displayAmount}
          </span>
          <span className="head-row-opening-balance-type ms-2">
            {balanceTypeLabel === "CR" ? (
              <CaretUpIcon fill="green" width="1.2rem" height="1.2rem" />
            ) : (
              <CaretDownIcon fill="red" width="1.2rem" height="1.2rem" />
            )}
          </span>
        </div>
      </td>
      <td>
        <HeadRowControl
          headId={headId}
          headName={name}
          onEdit={handleOpenEditHeadModal}
        />
      </td>
      {isEditHeadModalVisible && (
        <EditHeadModal
          show={isEditHeadModalVisible}
          headData={headData}
          onClose={handleCloseEditHeadModal}
        />
      )}
    </tr>
  );
}

export default HeadRow;
