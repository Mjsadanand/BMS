import  { useState, useEffect } from 'react';
import axios from 'axios';

const AdContractManagement = () => {
  const [contracts, setContracts] = useState([]); // Default to empty array
  const [contractData, setContractData] = useState({
    add_id: '',
    start_date: '',
    end_date: '',
    document_file: null
  });
  
  // Fetch contracts on component mount
  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ad-contracts');
      // Ensure that the response data is an array
      const contractsData = Array.isArray(response.data) ? response.data : [];
      setContracts(contractsData);
    } catch (error) {
      console.error('Error fetching contracts', error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setContractData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('add_id', contractData.add_id);
    formData.append('start_date', contractData.start_date);
    formData.append('end_date', contractData.end_date);
    formData.append('document_file', contractData.document_file);
  
    try {
      await axios.post('http://localhost:5000/api/ad-contracts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchContracts(); // Refresh the list
      // Reset form
      setContractData({
        add_id: '',
        start_date: '',
        end_date: '',
        document_file: null,
      });
    } catch (error) {
      console.error('Error creating contract', error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ad-contracts/${id}`);
      fetchContracts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting contract', error);
    }
  };
  

  return (
    <div className="ad-contract-management">
      <h2>Ad Contract Management</h2>
      
      {/* Contract Creation Form */}
      <form onSubmit={handleSubmit} className="contract-form">
        <input
          type="text"
          name="add_id"
          placeholder="Advertisement ID"
          value={contractData.add_id}
          onChange={handleChange}
          required
        />
        <label>Start Date</label>
        <input
          type="date"
          name="start_date"
          value={contractData.start_date}
          onChange={handleChange}
          required
        />
        <label>End Date</label>
        <input
          type="date"
          name="end_date"
          value={contractData.end_date}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="document_file"
          onChange={handleChange}
          required
        />
        <button type="submit">Create Contract</button>
      </form>

      {/* Contract List */}
      <div className="contract-list">
        <h3>Existing Contracts</h3>
        {contracts.length > 0 ? (
          contracts.map(contract => (
            <div key={contract._id} className="contract-item">
              <p>Contract ID: {contract._id}</p>
              <p>Advertisement ID: {contract.add_id}</p>
              <p>Start Date: {new Date(contract.start_date).toLocaleDateString()}</p>
              <p>End Date: {new Date(contract.end_date).toLocaleDateString()}</p>
              <p>Document: {contract.document_file}</p>
              <button onClick={() => handleDelete(contract._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No contracts available</p>
        )}
      </div>
    </div>
  );
};

export default AdContractManagement;
