import { useState, useEffect } from "react";
import axios from "axios";
import "./Property.css";
import { FaEdit, FaTrash, FaEye ,FaSearch} from "react-icons/fa";

const Property = () => {
  const [owners, setOwners] = useState([]); // List of property owners
  const [properties, setProperties] = useState([]); // List of properties
  const [editingOwnerId, setEditingOwnerId] = useState(null); // To track which owner is being edited
  const [ownerData, setOwnerData] = useState({
    name: "",
    contact: "",
    address: "",
    aadhar_number: "",
    email: "",
  });
  const [propertyData, setPropertyData] = useState({
    property_owner_id: "",
    survey_number: "",
    location_type: "",
    availability_status: true,
    longitude: "",
    latitude: "",
    address: "",
  });
  const [editingId, setEditingId] = useState(null); // To track which property is being edited
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState(null); // For view popup
  const [showPopup, setShowPopup] = useState(false); // For controlling popup visibility

  // Fetch owners and properties on component load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ownersResponse = await axios.get("http://localhost:5000/api/property-owners");
        setOwners(ownersResponse.data);
        const propertiesResponse = await axios.get("http://localhost:5000/api/properties");
        setProperties(propertiesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOwnerInputChange = (e) => {
    setOwnerData({ ...ownerData, [e.target.name]: e.target.value });
  };

  const handlePropertyInputChange = (e) => {
    setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
  };

  const handleOwnerSubmit = async (e) => {
    e.preventDefault();

    const ownerToSubmit = {
      name: ownerData.name,
      phone: ownerData.contact,  // Ensure the backend uses 'phone' for phone
      email: ownerData.email,
      aadhar_number: ownerData.aadhar_number,
      address: ownerData.address,  // Ensure address is included
    };

    // Check that all required fields are provided
    if (!ownerToSubmit.name || !ownerToSubmit.phone || !ownerToSubmit.email || !ownerToSubmit.aadhar_number || !ownerToSubmit.address) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      // If editing an owner, send PUT request, otherwise POST
      if (editingOwnerId) {
        await axios.put(`http://localhost:5000/api/property-owners/${editingOwnerId}`, ownerToSubmit);
      } else {
        await axios.post("http://localhost:5000/api/property-owners", ownerToSubmit);
      }
      setOwnerData({
        name: "",
        contact: "",
        address: "",
        aadhar_number: "",
        email: "",
      });
      setEditingOwnerId(null); // Reset editing owner
      const ownersResponse = await axios.get("http://localhost:5000/api/property-owners");
      setOwners(ownersResponse.data);
    } catch (error) {
      console.error("Error submitting owner:", error);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [propertySearchQuery, setPropertySearchQuery] = useState("");

  const filteredOwners = owners.filter((owner) =>
    owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
    // Filtered Properties
    const filteredProperties = properties.filter((property) =>
      property.survey_number.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
      property.location_type.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(propertySearchQuery.toLowerCase())
    );

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    const propertyToSend = {
      property_owner_id: propertyData.property_owner_id,
      survey_number: propertyData.survey_number,
      location_type: propertyData.location_type,
      availability_status: propertyData.availability_status,
      longitude: parseFloat(propertyData.longitude),
      latitude: parseFloat(propertyData.latitude),
      address: propertyData.address,
    };

    try {
      // If editing a property, update it, otherwise create a new one
      if (editingId) {
        await axios.put(`http://localhost:5000/api/properties/${editingId}`, propertyToSend);
      } else {
        await axios.post("http://localhost:5000/api/properties", propertyToSend);
      }
      setPropertyData({
        property_owner_id: "",
        survey_number: "",
        location_type: "",
        availability_status: true,
        longitude: "",
        latitude: "",
        address: "",
      });
      setEditingId(null); // Reset editing state
      const propertiesResponse = await axios.get("http://localhost:5000/api/properties");
      setProperties(propertiesResponse.data);
      alert("Property saved successfully!");
    } catch (error) {
      console.error("Error saving property:", error);
      alert("Error saving property.");
    }
  };

  const handleEditProperty = (property) => {
    setEditingId(property._id);
    setPropertyData({
      property_owner_id: property.property_owner_id,
      survey_number: property.survey_number,
      location_type: property.location_type,
      availability_status: property.availability_status,
      longitude: property.longitude,
      latitude: property.latitude,
      address: property.address,
    });
  };

  const handleDeleteProperty = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/properties/${id}`);
      const propertiesResponse = await axios.get("http://localhost:5000/api/properties");
      setProperties(propertiesResponse.data);
      alert("Property deleted successfully!");
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Error deleting property.");
    }
  };

  const handleViewOwner = (owner) => {
    setSelectedOwner(owner);
    setShowPopup(true);
  };

  const getOwnerName = (ownerId) => {
    if (ownerId && ownerId.name) {
      return ownerId.name;
    }
    const owner = owners.find((owner) => owner._id === ownerId);
    return owner ? owner.name : "Unknown";
  };

  const handleDeleteOwner = async (ownerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/property-owners/${ownerId}`);
      const ownersResponse = await axios.get("http://localhost:5000/api/property-owners");
      setOwners(ownersResponse.data);
      alert("Owner deleted successfully!");
    } catch (error) {
      console.error("Error deleting owner:", error);
      alert("Error deleting owner.");
    }
  };

  const handleEditOwner = (owner) => {
    setEditingOwnerId(owner._id);
    setOwnerData({
      name: owner.name,
      contact: owner.phone,
      address: owner.address,
      aadhar_number: owner.aadhar_number,
      email: owner.email,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="property-management">
      <h1>Property Management</h1>

      {/* Property Owner Form */}
      <div>
        <h2>{editingOwnerId ? "Edit Property Owner" : "Create Property Owner"}</h2>
        <form onSubmit={handleOwnerSubmit}>
          <input
            type="text"
            name="name"
            value={ownerData.name}
            onChange={handleOwnerInputChange}
            placeholder="Owner's Name"
            required
          />
          <input
            type="text"
            name="contact"
            value={ownerData.contact}
            onChange={handleOwnerInputChange}
            placeholder="Owner's Contact"
            required
          />
          <input
            type="text"
            name="address"
            value={ownerData.address}
            onChange={handleOwnerInputChange}
            placeholder="Owner's Address"
            required
          />
          <input
            type="text"
            name="aadhar_number"
            value={ownerData.aadhar_number}
            onChange={handleOwnerInputChange}
            placeholder="Owner's Aadhar Number"
            required
          />
          <input
            type="email"
            name="email"
            value={ownerData.email}
            onChange={handleOwnerInputChange}
            placeholder="Owner's Email"
            required
          />
          <button type="submit">{editingOwnerId ? "Update Owner" : "Create Owner"}</button>
        </form>
      </div>

      {/* Owner Table */}
      <h2>Owner List</h2>
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by Name, Phone, or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Adhaar</th>
            <th>Address</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOwners.map((owner) => (
            <tr key={owner._id}>
              <td>{owner.name}</td>
              <td>{owner.phone}</td>
              <td>{owner.aadhar_number}</td>
              <td>{owner.address}</td>
              <td>{owner.email}</td>
              <td>
                <button onClick={() => handleViewOwner(owner)}><FaEye /></button>
                <button onClick={() => handleEditOwner(owner)}><FaEdit /></button>
                <button onClick={() => handleDeleteOwner(owner._id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Popup */}
      {showPopup && selectedOwner && (
        <div className="popup">
          <div className="popup-content">
            <h3>Owner Details</h3>
            <p><strong>Name:</strong> {selectedOwner.name}</p>
            <p><strong>Email:</strong> {selectedOwner.email}</p>
            <p><strong>Contact:</strong> {selectedOwner.phone}</p>
            <p><strong>Aadhar Number:</strong> {selectedOwner.aadhar_number}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Property Form */}
      <div>
        <h2>{editingId ? "Edit Property" : "Create Property"}</h2>
        <form onSubmit={handlePropertySubmit}>
          <select
            name="property_owner_id"
            value={propertyData.property_owner_id}
            onChange={handlePropertyInputChange}
            required
          >
            <option value="">Select Property Owner</option>
            {owners.map((owner) => (
              <option key={owner._id} value={owner._id}>
                {owner.name} ({owner._id})
              </option>
            ))}
          </select>

          <input
            type="text"
            name="survey_number"
            value={propertyData.survey_number}
            onChange={handlePropertyInputChange}
            placeholder="Survey Number"
            required
          />
          <input
            type="text"
            name="location_type"
            value={propertyData.location_type}
            onChange={handlePropertyInputChange}
            placeholder="Location Type"
            required
          />
          <input
            type="text"
            name="address"
            value={propertyData.address}
            onChange={handlePropertyInputChange}
            placeholder="Address"
            required
          />
          <input
            type="number"
            name="longitude"
            value={propertyData.longitude}
            onChange={handlePropertyInputChange}
            placeholder="Longitude"
            required
          />
          <input
            type="number"
            name="latitude"
            value={propertyData.latitude}
            onChange={handlePropertyInputChange}
            placeholder="Latitude"
            required
          />
          <select
            name="availability_status"
            value={propertyData.availability_status}
            onChange={handlePropertyInputChange}
            required
          >
            <option value={true}>Available</option>
            <option value={false}>Occupied</option>
          </select>
          <button type="submit">{editingId ? "Update Property" : "Create Property"}</button>
        </form>
      </div>

      {/* Property Table */}
      <h2>Property List</h2>
            {/* Search Bar for Properties */}
            <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search Properties by Survey Number, Location, or Address"
          value={propertySearchQuery}
          onChange={(e) => setPropertySearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Survey Number</th>
            <th>Location Type</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProperties.map((property) => (
            <tr key={property._id}>
              <td>{getOwnerName(property.property_owner_id)}</td>
              <td>{property.survey_number}</td>
              <td>{property.location_type}</td>
              <td>{property.address}</td>
              <td>{property.availability_status ? "Available" : "Occupied"}</td>
              <td>
                <button onClick={() => handleEditProperty(property)}><FaEdit /></button>
                <button onClick={() => handleDeleteProperty(property._id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Property;
