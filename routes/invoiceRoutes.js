const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const {
    authMiddleware,
    adminMiddleware,
    invoiceAccessMiddleware
} = require('../middleware/authMiddleware');

// Create Invoice (Admin only)
router.post('/',authMiddleware, adminMiddleware, invoiceController.createInvoice);

// Get All Invoices (Admin sees all, Users see only their invoices)
router.get('/',authMiddleware, invoiceController.getAllInvoices);

// Get Single Invoice (with access control)
router.get('/:id',authMiddleware, invoiceAccessMiddleware, invoiceController.getInvoiceById);

// Update Invoice (Admin only)
router.put('/:id',authMiddleware, adminMiddleware, invoiceAccessMiddleware, invoiceController.updateInvoice);

// Delete Invoice (Admin only)
router.delete('/:id',authMiddleware, adminMiddleware, invoiceAccessMiddleware, invoiceController.deleteInvoice);

// Generate Invoice PDF
router.get('/:id/pdf', authMiddleware, invoiceAccessMiddleware, invoiceController.generateInvoicePDF);

module.exports = router;