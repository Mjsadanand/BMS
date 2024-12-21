import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    aadhar_number: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    join_date: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;
