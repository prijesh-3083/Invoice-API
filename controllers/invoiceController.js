// controllers/invoiceController.js
const Invoice = require('../models/Invoice');
const { generateInvoiceNumber } = require('../utils/invoiceNumberGenerator');
// const { invoiceCreatedEvent, invoiceUpdatedEvent, invoiceDeletedEvent } = require('../events/invoiceEvents');
const Joi = require('joi');
const PDFGenerator = require('../utils/pdfGenerator');


const updateSchema = Joi.object({
    paymentStatus: Joi.string().valid('pending', 'paid', 'overdue').required()
})
// Invoice validation schema
const invoiceSchema = Joi.object({
    customer: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().optional(),
        address: Joi.string().optional()
    }).required(),
    items: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        unitPrice: Joi.number().min(0).required()
    })).min(1).required(),
    dueDate: Joi.date().min('now').required(),
    taxRates: Joi.array().items(Joi.object({
        name: Joi.string().optional(),
        rate: Joi.number().min(0).max(100).required()
    })).optional(),
    discounts: Joi.array().items(Joi.object({
        name: Joi.string().optional(),
        amount: Joi.number().min(0).required()
    })).optional(),
    paymentStatus: Joi.string().valid('pending', 'paid', 'overdue').optional()
});

// Create Invoice
exports.createInvoice = async (req, res) => {
    try {
        // Validate input
        const { error, value } = invoiceSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: error.details[0].message 
            });
        }

        // Generate invoice number
        const invoiceNumber = await generateInvoiceNumber();

        // Create invoice instance
        const invoice = new Invoice({
            ...value,
            invoiceNumber,
            createdBy: req.userId
        });

        // Calculate totals
        invoice.calculateTotals();

        // Save invoice
        await invoice.save();

        // Trigger invoice created event
        // invoiceCreatedEvent(invoice);

        res.status(201).json({
            message: 'Invoice created successfully',
            invoice
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error during invoice creation',
            details: error.message 
        });
    }
};

// Get All Invoices
exports.getAllInvoices = async (req, res) => {
    try {
        let query = {};
        
        // If not admin, only show user's own invoices
        if (req.userRole !== 'admin') {
            query.createdBy = req.userId;
        }

        const invoices = await Invoice.find(query)
            .populate('createdBy', 'username email');

        res.json(invoices);
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error fetching invoices',
            details: error.message 
        });
    }
};

// Get Single Invoice
exports.getInvoiceById = async (req, res) => {
    try {
        // req.invoice is set by invoiceAccessMiddleware
        res.json(req.invoice);
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error fetching invoice',
            details: error.message 
        });
    }
};

// Update Invoice
exports.updateInvoice = async (req, res) => {
    try {
        // Validate input
        const { error, value } = updateSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: error.details[0].message 
            });
        }

        // Get existing invoice from middleware
        const invoice = req.invoice;

        // Update invoice fields
        invoice.set({
            ...value,
            createdBy: invoice.createdBy
        });

        // Recalculate totals
        invoice.calculateTotals();

        // Save updated invoice
        await invoice.save();

        // Trigger invoice updated event
        // invoiceUpdatedEvent(invoice);

        res.json({
            message: 'Invoice updated successfully',
            invoice
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error updating invoice',
            details: error.message 
        });
    }
};

// Delete Invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = req.invoice;

        // Delete invoice
        await invoice.deleteOne();

        // Trigger invoice deleted event
        // invoiceDeletedEvent(invoice);

        res.json({
            message: 'Invoice deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error deleting invoice',
            details: error.message 
        });
    }
};

// Generate Invoice PDF
exports.generateInvoicePDF = async (req, res) => {
    try {
        const invoice = req.invoice;

        // Generate PDF
        const pdfBuffer = await PDFGenerator.generateInvoicePDF(invoice);
        res.status(200).json({
            invoice:`invoice store to ${pdfBuffer}`
        })
        // Set response headers for PDF download
        // res.contentType('application/pdf');
        // res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
        // res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error generating invoice PDF',
            details: error.message 
        });
    }
};