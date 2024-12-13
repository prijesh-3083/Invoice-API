const Invoice = require('../models/Invoice');

exports.generateInvoiceNumber = async () => {
    // Get the last invoice to determine the next number
    const lastInvoice = await Invoice.findOne({}, {}, { sort: { createdAt: -1 } });
    
    // If no invoices exist, start from 1
    const nextNumber = lastInvoice 
        ? parseInt(lastInvoice.invoiceNumber.replace('INV-', '')) + 1 
        : 1;
    
    // Pad the number with zeros
    const paddedNumber = nextNumber.toString().padStart(6, '0');
    
    return `INV-${paddedNumber}`;
};