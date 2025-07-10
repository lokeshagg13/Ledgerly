import { Modal } from "react-bootstrap";

function ErrorModal({
  show,
  onHide,
  title = "Error",
  message = "Something went wrong.",
}) {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="error-message">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>
    </Modal>
  );
}

export default ErrorModal;
