import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  property_owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyOwner', required: true },
  survey_number: { type: String, required: true },
  location_type: { type: String, enum: ["Urban", "Rural"], required: true },
  availability_status: { type: Boolean, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  address: { type: String, required: true },
}); 

const Property = mongoose.model("Property", propertySchema);

export default Property;
