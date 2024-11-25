import express from 'express';
import Invoice from '../models/Invoice.js';
import PDFDocument from 'pdfkit';

const router = express.Router();

// Create Invoice
router.post('/create', async (req, res) => {
  try {
    const invoiceData = req.body;
    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get Invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('contract_id');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate PDF Invoice
router.get('/:id/download', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('contract_id');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice._id}.pdf`);
    
    doc.pipe(res);
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12)
      .text(`Invoice ID: ${invoice._id}`)
      .text(`Contract ID: ${invoice.contract_id._id}`)
      .text(`Total Amount: $${invoice.total_amount}`)
      .text(`Due Amount: $${invoice.due_amount}`)
      .text(`Balance Amount: $${invoice.balance_amount}`)
      .text(`Due Date: ${invoice.due_date.toDateString()}`)
      .text(`Transaction ID: ${invoice.payment.transaction_id}`)
      .text(`Payment Date: ${invoice.payment.date.toDateString()}`);
    
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;