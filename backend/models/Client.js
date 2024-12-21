import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true
  },
  industry_type: {
    type: String,
    required: true
  },
  gst_number: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  image: {
    type: String, // This could be a URL or base64 string
  }
}, { timestamps: true });

export default mongoose.model('Client', ClientSchema);
