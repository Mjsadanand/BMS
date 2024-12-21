import mongoose from "mongoose";

const propertyOwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aadhar_number: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },   // Add phone number field
  address: { type: String, required: true }, // Add address field
});

// Create the PropertyOwner model
const PropertyOwner = mongoose.model("PropertyOwner", propertyOwnerSchema);

export default PropertyOwner;
