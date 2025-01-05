import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './AdminLayout.css';

const API_URL = 'https://bms-ef6q.onrender.com/api/ads';
const CLIENTS_API_URL = 'https://bms-ef6q.onrender.com/api/clients';

const AdManagement = () => {
  const [ads, setAds] = useState([]);
  const [clients, setClients] = useState([]);
  const [adData, setAdData] = useState({
    add_name: '',
    add_type: 'Banner',
    language: 'English',
    file: null,
    client_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch ads and clients on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [adsResponse, clientsResponse] = await Promise.all([
          axios.get(API_URL),
          axios.get(CLIENTS_API_URL),
        ]);
        setAds(adsResponse.data);
        setClients(clientsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setAdData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = useCallback(
    async (e) => {
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
      formData.append('client_id', adData.client_id);

      setLoading(true);
      try {
        await axios.post(API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Reset form and refresh ads
        setAdData({
          add_name: '',
          add_type: 'Banner',
          language: 'English',
          file: null,
          client_id: '',
        });
        const response = await axios.get(API_URL);
        setAds(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create ad');
      } finally {
        setLoading(false);
      }
    },
    [adData]
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete ad');
    } finally {
      setLoading(false);
    }
  };

  const getClientName = (id) => clients.find((client) => client._id === id)?.name || 'Unknown Client';

  return (
    <div className="ad-management">
      <h2>Ad Management</h2>

      {loading && <p>Loading...</p>}
      {error && <div className="error-message">{error}</div>}

      {/* Ad Creation Form */}
      <form className="ad-form" onSubmit={handleSubmit}>
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
        <select
          name="client_id"
          value={adData.client_id}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Client
          </option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>
        <input type="file" name="file" onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Create Ad'}
        </button>
      </form>

      {/* Ad List */}
      <div className="ad-list">
        <h3>Existing Ads</h3>
        {ads.length > 0 ? (
          ads.map((ad) => (
            <div key={ad._id} className="ad-item">
              <p>Ad Name: {ad.add_name}</p>
              <p>Type: {ad.add_type}</p>
              <p>Language: {ad.language}</p>
              <p>Client: {getClientName(ad.client_id)}</p>
              <p>
                File: <a href={ad.file} target="_blank" rel="noopener noreferrer">View File</a>
              </p>
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
