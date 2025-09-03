import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { axiosPrivate } from "../../api/axios";
import HeadsContext from "./headsContext";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { formatAmountForDisplay } from "../../utils/formatUtils";

const DownloadEntrySetContext = createContext({
    isDownloadingEntrySetDetails: false,
    entrySetId: null,
    formattedEntrySetDate: null,
    handleDownloadEntrySetAsPDF: async () => { }
});

export const DownloadEntrySetContextProvider = ({ entrySetId, formattedEntrySetDate, children }) => {
    const { heads } = useContext(HeadsContext);
    const [isDownloadingEntrySetDetails, setIsDownloadingEntrySetDetails] = useState(false);

    async function fetchEntrySetDetails() {
        try {
            const res = await axiosPrivate.get(`/user/entrySet/${entrySetId}`);
            if (res?.data) {
                const formattedEntries = res.data.entries.map(entry => ({
                    sno: entry.serial,
                    type: entry.type === "credit" ? "C" : "D",
                    headId: entry.headId,
                    headName: heads.find(head => head._id === entry.headId)?.name || "",
                    credit: entry.amount && entry.type === "credit" ? entry.amount : "",
                    debit: entry.amount && entry.type === "debit" ? entry.amount : ""
                }));

                const sortedEntries = formattedEntries.sort((a, b) => a.sno - b.sno);
                return {
                    dataRows: sortedEntries,
                    balance: res.data.balance
                };
            }
        } catch (error) {
            toast.error(
                `Error occurred while fetching entry set details: ${error?.response?.data?.error || error?.message || error}`,
                { autoClose: 5000, position: "top-center" }
            );
        }
        return null;
    }

    async function handleDownloadEntrySetAsPDF() {
        try {
            setIsDownloadingEntrySetDetails(true);

            const fetched = await fetchEntrySetDetails();
            if (!fetched) return;

            const { dataRows, balance } = fetched;

            // Calculate debit and credit totals
            const debitTotal = dataRows.reduce((sum, row) => sum + (row.debit ? parseFloat(row.debit) : 0), 0);
            const creditTotal = dataRows.reduce((sum, row) => sum + (row.credit ? parseFloat(row.credit) : 0), 0);

            // Generate PDF
            const doc = new jsPDF();
            doc.text(`Date: ${formattedEntrySetDate}`, 14, 15);

            autoTable(doc, {
                startY: 35,
                head: [["S.No", "Type", "Head Name", "Debit", "Credit"]],
                body: [
                    ...dataRows.map(row => [
                        row.sno,
                        row.type,
                        row.headName,
                        row.debit,
                        row.credit
                    ]),
                    [
                        "", "",
                        `Balance: ${formatAmountForDisplay(balance).replace("₹", "Rs.")}`,
                        formatAmountForDisplay(debitTotal).replace("₹", "Rs."),
                        formatAmountForDisplay(creditTotal).replace("₹", "Rs.")
                    ]
                ],
                styles: { halign: 'center' },
                columnStyles: {
                    3: { halign: 'right' },
                    4: { halign: 'right' }
                },
                headStyles: { fillColor: [41, 128, 185] },
                didParseCell: function (data) {
                    if (data.row.index === data.table.body.length - 1) {
                        data.cell.styles.fillColor = [220, 220, 220];
                        if (data.column.index >= 2) {
                            data.cell.styles.halign = 'right';
                        }
                    }
                }
            });

            doc.save(`EntrySet_${formattedEntrySetDate}.pdf`);
        } catch (error) {
            toast.error(
                `Error occurred while downloading PDF: ${error?.response?.data?.error || error?.message || error}`,
                { autoClose: 5000, position: "top-center" }
            );
        } finally {
            setIsDownloadingEntrySetDetails(false);
        }
    }

    const currentContextValue = {
        isDownloadingEntrySetDetails,
        entrySetId,
        formattedEntrySetDate,
        handleDownloadEntrySetAsPDF
    };

    return (
        <DownloadEntrySetContext.Provider value={currentContextValue}>
            {children}
        </DownloadEntrySetContext.Provider>
    );
};

export default DownloadEntrySetContext;
