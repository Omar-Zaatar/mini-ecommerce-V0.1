import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportCustomersPdf = ({ customers, search }) => {
    const doc = new jsPDF();       const today = new Date();

        doc.setFontSize(18);
    doc.text('Mini E-Commerce: Customers Report', 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${today.toLocaleString()}`, 14, 25);
    doc.text(
        `Search: ${search ? `"${search}"` : 'None'}   |   Total customers: ${customers.length}`,
        14, 30
    );
    doc.setTextColor(0);

        autoTable(doc, {
        startY: 36,
        head: [['#', 'Name', 'Email', 'Phone']],
        body: customers.map((customer, index) => [
            String(index + 1),
            `${customer.firstName} ${customer.lastName}`,
            customer.email,
            customer.phone || '-'
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [0, 123, 255] }
    });

        const pageCount = doc.internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(130);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
    }

        doc.save(`customers-report-${today.toISOString().slice(0, 10)}.pdf`);
};