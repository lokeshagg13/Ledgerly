import { Overlay, Popover, Button } from "react-bootstrap";
import EditIcon from "../../../../../../ui/icons/EditIcon";
import TrashIcon from "../../../../../../ui/icons/TrashIcon";

function SubcategoryContextMenu({ anchor, show, onHide, onRename, onRemove }) {
  return (
    <Overlay
      show={show}
      target={anchor}
      placement="top-end"
      containerPadding={10}
      rootClose
      onHide={onHide}
    >
      <Popover className="subcategory-context-menu">
        <Popover.Body className="subcategory-context-body">
          <Button
            type="button"
            size="sm"
            onClick={onRename}
            className="subcategory-context-button context-rename-button"
            title="Rename"
          >
            <EditIcon width="1em" height="1em" />
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onRemove}
            className="subcategory-context-button context-remove-button"
            title="Delete"
          >
            <TrashIcon width="1em" height="1em" />
          </Button>
        </Popover.Body>
      </Popover>
    </Overlay>
  );
}

export default SubcategoryContextMenu;
