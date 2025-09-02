import { useContext, useState } from "react";
import { Form } from "react-bootstrap";

import HeadsContext from "../../../../store/context/headsContext";
import HeadRowControl from "./head-row-control/HeadRowControl";
import { formatAmountForDisplay } from "../../../../utils/formatUtils";
import EditHeadModal from "../../heads-modals/EditHeadModal";

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
      <td>{formatAmountForDisplay(openingBalance.amount)}</td>
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
