import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminLayout.css';

const API_URL = 'https://bms-ef6q.onrender.com/api/ads';
const CLIENTS_API_URL = 'https://bms-ef6q.onrender.com/api/clients'; // Update this URL to your clients API endpoint

const AdManagement = () => {
  const [ads, setAds] = useState([]);
  const [clients, setClients] = useState([]); // Store list of clients
  const [adData, setAdData] = useState({
    add_name: '',
    add_type: 'Banner',
    language: 'English',
    file: null,
    client_id: '', // Add client_id field to state
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get(API_URL);
        setAds(response.data);
      } catch (err) {
        setError('Error fetching ads');
        console.error(err);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get(CLIENTS_API_URL); // Fetch clients from API
        setClients(response.data);
      } catch (err) {
        setError('Error fetching clients');
        console.error(err);
      }
    };

    fetchAds();
    fetchClients(); // Fetch clients on component mount
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setAdData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // Handle file input as well
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adData.file || !adData.client_id) {
      setError('File and Client are required');
      return;
    }

    const formData = new FormData();
    formData.append('add_name', adData.add_name);
    formData.append('add_type', adData.add_type);
    formData.append('language', adData.language);
    formData.append('file', adData.file);
    formData.append('client_id', adData.client_id); // Add client_id to FormData

    try {
      await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Reset form after successful submission
      setAdData({
        add_name: '',
        add_type: 'Banner',
        language: 'English',
        file: null,
        client_id: '', // Reset client_id
      });
    } catch (error) {
      setError('Error creating ad');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updatedAds = ads.filter(ad => ad._id !== id);
      setAds(updatedAds);
    } catch (error) {
      setError('Error deleting ad');
      console.error(error);
    }
  };

  return (
    <div className="ad-management">
      <h2>Ad Management</h2>

      {/* Ad Creation Form */}
      <form onSubmit={handleSubmit} className="ad-form">
        <input
          type="text"
          name="add_name"
          placeholder="Ad Name"
          value={adData.add_name}
          onChange={handleChange}
          required
        />
        <select name="add_type" value={adData.add_type} onChange={handleChange}>
          <option value="Banner">Banner</option>
          <option value="Poster">Poster</option>
          <option value="Digital">Digital</option>
          <option value="Print">Print</option>
        </select>
        <select name="language" value={adData.language} onChange={handleChange}>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
        </select>

        {/* Client selection dropdown */}
        <select
          name="client_id"
          value={adData.client_id}
          onChange={handleChange}
          required
          placeholder="Select Client"
        >
          <option value="" disabled>Select Client</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>


        <input type="file" name="file" onChange={handleChange} required />
        <button type="submit">Create Ad</button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Ad List */}
      <div className="ad-list">
        <h3>Existing Ads</h3>
        {ads.length > 0 ? (
          ads.map((ad) => (
            <div key={ad._id} className="ad-item">
              <p>Ad Name: {ad.add_name}</p>
              <p>Type: {ad.add_type}</p>
              <p>Language: {ad.language}</p>
              <p>Client: {ad.client_id}</p>
              <p>File: {ad.file}</p>
              <button onClick={() => handleDelete(ad._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No ads available</p>
        )}
      </div>
    </div>
  );
};

export default AdManagement;
