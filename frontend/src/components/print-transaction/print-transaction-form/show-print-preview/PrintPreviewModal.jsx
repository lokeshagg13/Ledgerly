import { useContext, useEffect, useRef, useState } from "react";
import { Image, Modal } from "react-bootstrap";
import TransactionPrintContext from "../../../../store/context/transactionPrintContext";
import PrintPreviewControl from "./PrintPreviewControl";

function PrintPreviewModal() {
  const {
    isPrintPreviewVisible,
    printPreviewCurrentData,
    printPreviewSlideDirection,
    handleClosePrintPreview,
  } = useContext(TransactionPrintContext);

  const { imageData } = printPreviewCurrentData;
  const [slideAnimationClass, setSlideAnimationClass] = useState("");
  const prevImageRef = useRef(imageData);

  useEffect(() => {
    if (!prevImageRef.current || prevImageRef.current === imageData) return;

    if (printPreviewSlideDirection === "left")
      setSlideAnimationClass("slide-left");
    else if (printPreviewSlideDirection === "right")
      setSlideAnimationClass("slide-right");

    const timeout = setTimeout(() => setSlideAnimationClass(""), 600);
    prevImageRef.current = imageData;
    return () => clearTimeout(timeout);
  }, [imageData, printPreviewSlideDirection]);

  return (
    <Modal
      show={isPrintPreviewVisible}
      onHide={handleClosePrintPreview}
      centered
      dialogClassName="preview-a4-sheet-modal"
      backdrop="static"
      contentClassName="preview-a4-sheet-modal-content"
    >
      <div className="preview-a4-sheet-container">
        <div className="preview-a4-sheet-wrapper">
          <PrintPreviewControl />
          <div
            className={`preview-a4-sheet-content animated-container ${slideAnimationClass}`}
          >
            <Image
              className="preview-a4-sheet-image"
              src={imageData}
              alt="Data"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PrintPreviewModal;
