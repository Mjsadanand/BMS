import Client from "../models/Client.js"; // Import the Client model
import path from 'path'; // To handle file paths (if necessary)
import fs from 'fs'; // To delete uploaded files (if necessary)

// Fetch all clients
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Error fetching clients", error: error.message });
  }
};

// Add a new client (with image upload handling)
const addClient = async (req, res) => {
  try {
    // Check if an image is uploaded and get the file path
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // Create a new client object with the provided data
    const newClient = new Client({
      ...req.body, // Spread other client data from the request body
      image: imageUrl, // Save the image path in the image field
    });

    // Save the new client to the database
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    console.error("Error adding client:", error);
    res.status(400).json({ message: "Error adding client", error: error.message });
  }
};

// Update an existing client (with image update handling)
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;

    // If a new image is uploaded, handle the image field
    let imageUrl = req.body.image; // Retain the old image if no new one is uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`; // Set the new image URL
    }

    // Update the client with the new data
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { ...req.body, image: imageUrl }, // Update the image field if a new one is uploaded
      { new: true, runValidators: true }
    );
 
    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(400).json({ message: "Error updating client", error: error.message });
  }
};

// Delete a client
const deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Optionally delete the image file from the server (if it exists)
    if (deletedClient.image) {
      const imagePath = path.join(__dirname, '..', deletedClient.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the image from the server
      }
    }

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ message: "Error deleting client", error: error.message });
  }
};

// Export the controller functions using ES6 export
export { getAllClients, addClient, updateClient, deleteClient };
