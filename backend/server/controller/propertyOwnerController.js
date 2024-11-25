import PropertyOwner from "../models/PropertyOwner.js";

// Fetch all property owners
// Fetch all property owners
export const getAllOwners = async (req, res) => {
  try {
    const owners = await PropertyOwner.find();
    res.json(owners);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch owners" });
  }
};

// Delete a property owner
export const deleteOwner = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the owner by ID
    const deletedOwner = await PropertyOwner.findByIdAndDelete(id);

    if (!deletedOwner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    res.status(200).json({ message: "Owner deleted successfully" });
  } catch (error) {
    console.error("Error deleting owner:", error);
    res.status(500).json({ error: "Failed to delete owner", details: error.message });
  }
};


// Create a new property owner
export const createOwner = async (req, res) => {
  try {
    const { name, aadhar_number, email, phone, address } = req.body;

    // Validate required fields
    if (!name || !aadhar_number || !email || !phone || !address) {
      return res.status(400).json({ error: "Missing required fields: name, aadhar_number, email, phone, address" });
    }

    // Check for unique Aadhar number (if required)
    const existingOwner = await PropertyOwner.findOne({ aadhar_number });
    if (existingOwner) {
      return res.status(400).json({ error: "Owner with this Aadhar number already exists" });
    }

    // Create a new owner object with the added fields
    const newOwner = new PropertyOwner({ name, aadhar_number, email, phone, address });

    // Save the new owner to the database
    await newOwner.save();
    res.status(201).json(newOwner);
  } catch (error) {
    console.error("Error creating owner:", error);
    res.status(500).json({ error: "Failed to create owner", details: error.message });
  }
};


// Update an existing property owner
export const updateOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, aadhar_number, email, phone, address } = req.body;

    // Validate required fields
    if (!name || !aadhar_number || !email || !phone || !address) {
      return res.status(400).json({ error: "Missing required fields: name, aadhar_number, email, phone, address" });
    }

    // Find the owner by ID and update their information
    const updatedOwner = await PropertyOwner.findByIdAndUpdate(
      id,
      { name, aadhar_number, email, phone, address },
      { new: true }
    );

    if (!updatedOwner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    res.status(200).json(updatedOwner);
  } catch (error) {
    console.error("Error updating owner:", error);
    res.status(500).json({ error: "Failed to update owner", details: error.message });
  }
};



