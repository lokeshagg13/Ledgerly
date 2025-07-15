import jsPDF from "jspdf";

export async function downloadPrintPreviewPDF(pages, fileName = "transactions.pdf") {
    if (!pages || pages.length === 0) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
    });
    for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();
        const imgData = pages[i];
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    }
    pdf.save(fileName);
}
