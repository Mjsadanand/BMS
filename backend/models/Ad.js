import mongoose from 'mongoose';

const AdSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  add_name: {
    type: String,
    required: true,
    trim: true
  },
  add_type: {
    type: String,
    enum: ['Banner', 'Poster', 'Digital', 'Print'],
    required: true
  },
  language: {
    type: String,
    default: 'English'
  },
  file: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Pending'
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Advertisement', AdSchema);
