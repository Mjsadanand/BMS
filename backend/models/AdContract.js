import mongoose from 'mongoose';

const AdContractSchema = new mongoose.Schema({
  add_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advertisement',
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  document_file: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'terminated'],
    default: 'active'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('AdvertisementContract', AdContractSchema);