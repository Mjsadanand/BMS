import mongoose from 'mongoose';
import Property from '../models/Property.js'; // Update path as needed
import Billboard from '../models/Billboard.js'; // Update path as needed

// Create a new Billboard and associate it with a Property
const createBillboard = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // First, verify the property exists
    const property = await Property.findById(req.body.property).session(session);
    if (!property) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Property not found' });
    }

    // Create the billboard
    const newBillboard = new Billboard({
      property: req.body.property,
      type: req.body.type,
      dimensions: req.body.dimensions,
      visibility: req.body.visibility,
      altitude: req.body.altitude,
      status: req.body.status || 'Available',
      rentPrice: req.body.rentPrice
    });

    // Save the billboard
    const savedBillboard = await newBillboard.save({ session });

    // Add billboard to property's billboards array
    property.billboards.push(savedBillboard._id);
    await property.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Billboard created and associated with property',
      billboard: savedBillboard
    });
  } catch (error) {
    // If transaction fails, abort and send error
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      message: 'Error creating billboard',
      error: error.message
    });
  }
};

// Get billboard with property details
const getBillboardWithProperty = async (req, res) => {
  try {
    const billboard = await Billboard.findById(req.params.id)
      .populate('property', 'address owner contactEmail location');

    if (!billboard) {
      return res.status(404).json({ message: 'Billboard not found' });
    }

    res.status(200).json(billboard);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving billboard',
      error: error.message
    });
  }
};

// Get all billboards for a specific property
const getBillboardsByProperty = async (req, res) => {
  try {
    const billboards = await Billboard.find({ property: req.params.propertyId })
      .populate('property', 'address');

    res.status(200).json({
      count: billboards.length,
      billboards: billboards
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving billboards',
      error: error.message
    });
  }
};

export { createBillboard, getBillboardWithProperty, getBillboardsByProperty };
