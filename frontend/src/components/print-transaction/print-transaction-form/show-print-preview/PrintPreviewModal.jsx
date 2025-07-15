import { useContext, useEffect, useRef, useState } from "react";
import { Image, Modal } from "react-bootstrap";
import TransactionPrintContext from "../../../../store/context/transactionPrintContext";
import PrintPreviewControl from "./PrintPreviewControl";

function PrintPreviewModal() {
  const {
    isPrintPreviewVisible,
    printPreviewCurrentData,
    printPreviewSlideDirection,
    printPreviewZoomLevel,
    handleClosePrintPreview,
    resetPrintPreviewZoomLevel,
  } = useContext(TransactionPrintContext);

  const { imageData } = printPreviewCurrentData;
  const [slideAnimationClass, setSlideAnimationClass] = useState("");
  const prevImageRef = useRef(imageData);

  // Disable unnecessary scroll
  useEffect(() => {
    const preventTouchMove = (e) => {
      if (!e.target.closest(".preview-a4-sheet-content")) {
        e.preventDefault();
      }
    };

    if (isPrintPreviewVisible) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.addEventListener("touchmove", preventTouchMove, {
        passive: false,
      });
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.removeEventListener("touchmove", preventTouchMove);
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.removeEventListener("touchmove", preventTouchMove);
    };
  }, [isPrintPreviewVisible]);

  // Slide animation on image change
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

  // Reset zoom on page/image change
  useEffect(() => {
    resetPrintPreviewZoomLevel();
    // eslint-disable-next-line
  }, [imageData]);

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
            className={`preview-a4-sheet-content ${slideAnimationClass} ${
              printPreviewZoomLevel > 1 ? "zoomed" : ""
            }`}
          >
            <Image
              src={imageData}
              alt="Preview Image"
              className="preview-a4-sheet-image"
              style={{
                transform: `scale(${printPreviewZoomLevel})`,
                transformOrigin: "top left",
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PrintPreviewModal;
