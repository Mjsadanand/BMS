import Advertisement from '../models/Ad.js';
import Client from '../models/Client.js'; // Import Client model for validation



export const createAd = async (req, res) => {
  try {
    // Ensure client_id is provided in the request body
    const { client_id, add_name, add_type, language, file, status } = req.body;

    if (!client_id) {
      return res.status(400).json({ message: "Client ID is required" });
    }

    // Validate if the provided client_id exists in the Client collection
    const client = await Client.findById(client_id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Create a new advertisement with the provided data
    const newAd = new Advertisement({
      client_id,
      add_name,
      add_type,
      language,
      file,
      status,
    });

    // Save the advertisement
    const savedAd = await newAd.save();

    // Respond with the saved advertisement
    res.status(201).json(savedAd);
  } catch (error) {
    res.status(500).json({ message: "Error creating advertisement", error });
  }
};

// Get All Ads with populated client details
export const getAllAds = async (req, res) => {
  try {
    // Populate 'client_id' to include client details with each ad
    const ads = await Advertisement.find().populate('client_id', 'name'); // Assuming 'name' is a field in the Client model

    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching advertisements", error });
  }
};

// Get Ad by ID with populated client details
export const getAdById = async (req, res) => {
  try {
    // Find advertisement by ID and populate 'client_id' with client details
    const ad = await Advertisement.findById(req.params.id).populate('client_id', 'name');

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ message: "Error fetching advertisement", error });
  }
};

// Update Ad
export const updateAd = async (req, res) => {
  try {
    // Find the advertisement by ID and update it
    const updatedAd = await Advertisement.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.status(200).json(updatedAd);
  } catch (error) {
    res.status(500).json({ message: "Error updating advertisement", error });
  }
};

// Delete Ad
export const deleteAd = async (req, res) => {
  try {
    // Delete the advertisement by ID
    const deletedAd = await Advertisement.findByIdAndDelete(req.params.id);

    if (!deletedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting advertisement", error });
  }
};
