import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  contract_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true
  },
  total_amount: {
    type: Number,
    required: true
  },
  due_amount: {
    type: Number,
    required: true
  },
  balance_amount: {
    type: Number,
    required: true
  },
  due_date: {
    type: Date,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  payment: {
    transaction_id: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'OVERDUE'],
    default: 'PENDING'
  }
});

export default mongoose.model('invoice', InvoiceSchema);