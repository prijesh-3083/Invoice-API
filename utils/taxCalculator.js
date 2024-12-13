class TaxCalculator {
    static calculateTax(subtotal, taxRates) {
        return taxRates.reduce((total, tax) => {
            return total + (subtotal * (tax.rate / 100));
        }, 0);
    }

    static applyDiscounts(total, discounts) {
        return discounts.reduce((currentTotal, discount) => {
            return currentTotal - discount.amount;
        }, total);
    }
}

module.exports = TaxCalculator;