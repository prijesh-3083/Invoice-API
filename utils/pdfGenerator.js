const {PDFDocument,rgb,StandardFonts} = require('pdf-lib');
const fs = require('fs');
const path = require('path');

class PDFGenerator {
    static async generateInvoicePDF(invoice) {
        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        
        // Get page dimensions
        const { width, height } = page.getSize();
        const fontSize = 12;
        
        // Start drawing
        const pageMargin = 50;
        page.drawText('INVOICE', {
            x: pageMargin,
            y: height - pageMargin,
            size: 18,
            color: rgb(0, 0, 0)
        });
        
        // Invoice Number
        page.drawText(`Invoice Number: ${invoice.invoiceNumber}`, {
            x: pageMargin,
            y: height - pageMargin - 30,
            size: fontSize
        });
        
        // Customer Details
        page.drawText(`Customer: ${invoice.customer.name}`, {
            x: pageMargin,
            y: height - pageMargin - 50,
            size: fontSize
        });
        
        // Invoice Date and Due Date
        page.drawText(`Invoice Date: ${invoice.invoiceDate.toDateString()}`, {
            x: pageMargin,
            y: height - pageMargin - 70,
            size: fontSize
        });
        
        page.drawText(`Due Date: ${invoice.dueDate.toDateString()}`, {
            x: pageMargin,
            y: height - pageMargin - 90,
            size: fontSize
        });
        
        // Items Table
        let yPosition = height - pageMargin - 120;
        page.drawText('Items', {
            x: pageMargin,
            y: yPosition,
            size: fontSize + 2,
            color: rgb(0.2, 0.2, 0.2)
        });
        
        yPosition -= 20;
        
        // Table headers
        page.drawText('Item', { x: pageMargin, y: yPosition, size: fontSize });
        page.drawText('Quantity', { x: pageMargin + 200, y: yPosition, size: fontSize });
        page.drawText('Unit Price', { x: pageMargin + 300, y: yPosition, size: fontSize });
        page.drawText('Total', { x: pageMargin + 400, y: yPosition, size: fontSize });
        
        yPosition -= 20;
        
        // Draw items
        invoice.items.forEach(item => {
            const itemTotal = item.quantity * item.unitPrice;
            
            page.drawText(item.name, { x: pageMargin, y: yPosition, size: fontSize });
            page.drawText(item.quantity.toString(), { x: pageMargin + 200, y: yPosition, size: fontSize });
            page.drawText(`$${item.unitPrice.toFixed(2)}`, { x: pageMargin + 300, y: yPosition, size: fontSize });
            page.drawText(`$${itemTotal.toFixed(2)}`, { x: pageMargin + 400, y: yPosition, size: fontSize });
            
            yPosition -= 20;
        });
        
        // Totals
        page.drawText(`Subtotal: $${invoice.subtotal.toFixed(2)}`, {
            x: pageMargin + 300,
            y: yPosition,
            size: fontSize
        });
        
        yPosition -= 20;
        
        // Tax details
        invoice.taxRates.forEach(tax => {
            page.drawText(`${tax.name} (${tax.rate}%): $${(invoice.subtotal * tax.rate / 100).toFixed(2)}`, {
                x: pageMargin + 300,
                y: yPosition,
                size: fontSize
            });
            yPosition -= 20;
        });
        
        // Discounts
        invoice.discounts.forEach(discount => {
            page.drawText(`${discount.name}: $${discount.amount.toFixed(2)}`, {
                x: pageMargin + 300,
                y: yPosition,
                size: fontSize
            });
            yPosition -= 20;
        });
        
        // Total Amount
        page.drawText(`Total Amount: $${invoice.totalAmount.toFixed(2)}`, {
            x: pageMargin + 300,
            y: yPosition,
            size: fontSize + 2,
            color: rgb(0, 0.5, 0)
        });
        
        // Finalize PDF
        const pdfBytes = await pdfDoc.save();
        const pdfpath = path.join('statics',`${invoice.invoiceNumber}.pdf`)
        fs.writeFile(pdfpath,pdfBytes,(err)=>{
            if(err){
                console.log(err)
            }
        })

        return pdfpath ;
    }
}

module.exports = PDFGenerator;