import Property from "../models/Property.js";
import mongoose from "mongoose";


// Fetch all properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("property_owner_id");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// Create a new property
export const createProperty = async (req, res) => {
  try {
    const { property_owner_id, survey_number, location_type, availability_status, longitude, latitude, address } = req.body;

    // Ensure property_owner_id is valid
    if (!mongoose.Types.ObjectId.isValid(property_owner_id)) {
      return res.status(400).json({ error: "Invalid property_owner_id" });
    }

    const newProperty = new Property({
      property_owner_id,
      survey_number,
      location_type,
      availability_status,
      longitude,
      latitude,
      address,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: "Failed to create property", details: error.message });
  }
};

// Update property
export const updateProperty = async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: "Failed to update property" });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete property" });
  }
};
