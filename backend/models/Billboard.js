import mongoose from 'mongoose';

const billboardSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  type: {
    type: String,
    enum: ['Digital', 'Traditional', 'LED', 'Static'],
    required: true
  },
  dimensions: {
    type: String,
    required: true
  },
  visibility: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true
  },
  altitude: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Booked', 'Maintenance', 'Unavailable'],
    default: 'Available'
  },
  rentPrice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Billboard = mongoose.model('Billboard', billboardSchema);

export default Billboard;
