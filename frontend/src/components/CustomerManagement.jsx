import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
import "./customerManagement.css"; // Scoped CSS file

const CustomerManagement = () => {
  const [clients, setClients] = useState([]);
  const [clientData, setClientData] = useState({
    company_name: "",
    industry_type: "",
    gst_number: "",
    email: "",
    phone: "",
    address: "",
    image: "", // Added image field
  });
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [viewData, setViewData] = useState(null); // State for modal data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Fetch clients on component mount
  useEffect(() => {
    axios
      .get("https://bms-ef6q.onrender.com/api/clients")
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.log("Error fetching clients:", error);
        setClients([]); // Reset to empty array in case of error
      });
  }, []);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  // Handle image file upload and display preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the image preview
        setClientData({ ...clientData, image: reader.result }); // Store the image data in state
      };
      reader.readAsDataURL(file); // Convert the file to base64 data
    }
  };

  // Add a new client
  const handleAddClient = () => {
    const isDuplicate = clients.some(client => client.gst_number === clientData.gst_number);
    if (isDuplicate) {
      alert('This GST number already exists.');
      return;
    }

    axios.post("https://bms-ef6q.onrender.com/api/clients", clientData)
      .then((response) => {
        setClients([...clients, response.data]);
        setClientData({
          company_name: "",
          industry_type: "",
          gst_number: "",
          email: "",
          phone: "",
          address: "",
          image: "",
        });
        setImagePreview(null);
      })
      .catch((error) => {
        console.error("Error during POST:", error.response ? error.response.data : error.message);
      });
  };

  // Edit an existing client
  const handleEditClient = (id) => {
    const client = clients.find((c) => c._id === id);
    setClientData(client);
    setImagePreview(client.image); // Set image preview from existing data
    setEditing(true);
    setCurrentId(id);
  };

  // Update client data
  const handleUpdateClient = () => {
    axios.put(`https://bms-ef6q.onrender.com/api/clients/${currentId}`, clientData)
      .then((response) => {
        setClients(clients.map((c) => c._id === currentId ? response.data : c));
        setEditing(false);
        setClientData({
          company_name: "",
          industry_type: "",
          gst_number: "",
          email: "",
          phone: "",
          address: "",
          image: "", // Reset image field
        });
        setImagePreview(null); // Reset image preview
      })
      .catch((error) => {
        console.error("Error updating client:", error);
      });
  };

  // Delete a client
  const handleDeleteClient = (id) => {
    axios.delete(`https://bms-ef6q.onrender.com/api/clients/${id}`)
      .then(() => {
        setClients(clients.filter((c) => c._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting client:", error);
      });
  };

  // View client details in a modal
  const handleViewClient = (client) => {
    setViewData(client);
  };

  // Close the client details modal
  const closeViewModal = () => {
    setViewData(null);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter clients based on the search query
  const filteredClients = clients.filter((client) => {
    return (
      client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.gst_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="client-management-container">
      <h2><strong>Client Management</strong></h2>



      <div className="client-form">
        <input
          type="text"
          name="company_name"
          placeholder="Company Name"
          value={clientData.company_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="industry_type"
          placeholder="Industry Type"
          value={clientData.industry_type}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="gst_number"
          placeholder="GST Number"
          value={clientData.gst_number}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={clientData.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={clientData.phone}
          onChange={handleInputChange}
        />
        <textarea
          name="address"
          placeholder="Address"
          value={clientData.address}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" className="preview-image" />
          </div>
        )}
        {editing ? (
          <button onClick={handleUpdateClient}>Update Client</button>
        ) : (
          <button onClick={handleAddClient} className="add-button">
            Add Client
          </button>
        )}
      </div>
      {/* Search Bar */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by Company, GST, or Email"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>
      <table className="client-management-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Industry Type</th>
            <th>GST Number</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client._id}>
              <td>{client.company_name}</td>
              <td>{client.industry_type}</td>
              <td>{client.gst_number}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>{client.address}</td>
              <td>
                <button onClick={() => handleEditClient(client._id)}><FaEdit /></button>
                <button onClick={() => handleDeleteClient(client._id)}><FaTrash /></button>
                <button onClick={() => handleViewClient(client)}><FaEye /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewData && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeViewModal}>&times;</span>
            <h3>{viewData.company_name}</h3>
            <img src={viewData.image} alt="Client" className="client-image" />
            <p><strong>Industry:</strong> {viewData.industry_type}</p>
            <p><strong>GST Number:</strong> {viewData.gst_number}</p>
            <p><strong>Email:</strong> {viewData.email}</p>
            <p><strong>Phone:</strong> {viewData.phone}</p>
            <p><strong>Address:</strong> {viewData.address}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
