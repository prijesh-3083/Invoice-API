const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: String,
        address: String
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    invoiceDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    taxRates: [{
        name: String,
        rate: {
            type: Number,
            min: 0,
            max: 100
        }
    }],
    discounts: [{
        name: String,
        amount: {
            type: Number,
            min: 0
        }
    }],
    subtotal: {
        type: Number,
        required: true
    },
    taxTotal: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Method to calculate total amount
InvoiceSchema.methods.calculateTotals = function() {
    // Calculate subtotal
    this.subtotal = this.items.reduce((total, item) => 
        total + (item.quantity * item.unitPrice), 0);

    // Calculate tax
    this.taxTotal = this.taxRates.reduce((taxSum, tax) => 
        taxSum + (this.subtotal * (tax.rate / 100)), 0);

    // Apply discounts
    const totalDiscounts = this.discounts.reduce((discSum, discount) => 
        discSum + discount.amount, 0);

    // Calculate final total
    this.totalAmount = this.subtotal + this.taxTotal - totalDiscounts;

    return this;
};

const Invoice = mongoose.model('Invoice', InvoiceSchema);
module.exports = Invoice;