import { useState, useEffect } from 'react';
import axios from 'axios';

const Billboard = () => {
  // State management
  const [billboards, setBillboards] = useState([]);  // Default to empty array
  const [properties, setProperties] = useState([]);
  const [selectedBillboard, setSelectedBillboard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    visibility: ''
  });

  // Form data state
  const [formData, setFormData] = useState({
    type: '',
    dimensions: '',
    visibility: '',
    altitude: '',
    status: 'Available',
    rentPrice: '',
    property: '',
    image: null
  });

  // Fetch billboards and properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billboardsResponse, propertiesResponse] = await Promise.all([
          axios.get('/api/billboards'),
          axios.get('/api/properties')
        ]);

        // Safely set the data only if they exist
        setBillboards(billboardsResponse?.data?.billboards || []);  // Default to empty array if undefined
        setProperties(propertiesResponse?.data?.properties || []);  // Default to empty array if undefined
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  // Filtering logic: Ensure billboards is an array before calling filter
  const filteredBillboards = (Array.isArray(billboards) ? billboards : []).filter(billboard => {
    const matchesSearch = !searchTerm || 
      billboard.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billboard.dimensions.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTypeFilter = !filters.type || billboard.type === filters.type;
    const matchesStatusFilter = !filters.status || billboard.status === filters.status;
    const matchesVisibilityFilter = !filters.visibility || billboard.visibility === filters.visibility;

    return matchesSearch && matchesTypeFilter && matchesStatusFilter && matchesVisibilityFilter;
  });

  // Modal and form handlers
  const openDetailModal = (billboard) => {
    setSelectedBillboard(billboard);
    setIsModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedBillboard(null);
    setIsModalOpen(false);
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    // Reset form data
    setFormData({
      type: '',
      dimensions: '',
      visibility: '',
      altitude: '',
      status: 'Available',
      rentPrice: '',
      property: '',
      image: null
    });
  };

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    // Handle file upload separately
    if (name === 'image') {
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit billboard
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const uploadData = new FormData();
    Object.keys(formData).forEach(key => {
      uploadData.append(key, formData[key]);
    });

    try {
      const response = await axios.post('/api/billboards', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Add new billboard to list
      setBillboards([...billboards, response.data.billboard]);
      
      // Close modal and reset form
      closeUploadModal();
    } catch (error) {
      console.error('Error uploading billboard', error);
      alert('Failed to upload billboard');
    }
  };

  // Delete billboard
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/billboards/${id}`);
      setBillboards(billboards.filter(b => b._id !== id));
    } catch (error) {
      console.error('Error deleting billboard', error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Header and Actions */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billboard Management</h1>
        <button 
          onClick={openUploadModal}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add New Billboard
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex space-x-4">
          <input 
            type="text" 
            placeholder="Search billboards..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border rounded"
          />
          
          {/* Type Filter */}
          <select 
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="">All Types</option>
            <option value="Digital">Digital</option>
            <option value="Traditional">Traditional</option>
            <option value="LED">LED</option>
            <option value="Static">Static</option>
          </select>

          {/* Status Filter */}
          <select 
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          {/* Visibility Filter */}
          <select 
            value={filters.visibility}
            onChange={(e) => setFilters({...filters, visibility: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="">All Visibilities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Billboards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBillboards.map(billboard => (
          <div 
            key={billboard._id} 
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow"
          >
            {billboard.image && (
              <img 
                src={billboard.image} 
                alt="Billboard" 
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
            )}
            
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{billboard.type} Billboard</h3>
              <span className={`
                px-2 py-1 rounded-full text-sm 
                ${billboard.status === 'Available' 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-red-200 text-red-800'}`}>
                {billboard.status}
              </span>
            </div>
            
            <div className="mb-4">
              <p>Dimensions: {billboard.dimensions}</p>
              <p>Visibility: {billboard.visibility}</p>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => openDetailModal(billboard)}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                View Details
              </button>
              <button 
                onClick={() => handleDelete(billboard._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {/* Modal for adding new billboard (Upload Modal) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4">Add New Billboard</h2>
            
            {/* Billboard Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block">Type</label>
                    <select 
                      name="type" 
                      value={formData.type}
                      onChange={handleInputChange} 
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Type</option>
                      <option value="Digital">Digital</option>
                      <option value="Traditional">Traditional</option>
                      <option value="LED">LED</option>
                      <option value="Static">Static</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block">Dimensions</label>
                    <input 
                      type="text" 
                      name="dimensions" 
                      value={formData.dimensions}
                      onChange={handleInputChange} 
                      className="w-full p-2 border rounded" 
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block">Visibility</label>
                    <select 
                      name="visibility" 
                      value={formData.visibility} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Visibility</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block">Altitude</label>
                    <input 
                      type="text" 
                      name="altitude" 
                      value={formData.altitude}
                      onChange={handleInputChange} 
                      className="w-full p-2 border rounded" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block">Rent Price</label>
                  <input 
                    type="text" 
                    name="rentPrice" 
                    value={formData.rentPrice} 
                    onChange={handleInputChange} 
                    className="w-full p-2 border rounded" 
                  />
                </div>

                <div>
                  <label className="block">Property</label>
                  <select 
                    name="property" 
                    value={formData.property}
                    onChange={handleInputChange} 
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Property</option>
                    {properties.map(property => (
                      <option key={property._id} value={property._id}>
                        {property.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block">Image</label>
                  <input 
                    type="file" 
                    name="image" 
                    onChange={handleInputChange} 
                    className="w-full p-2 border rounded" 
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <button 
                    type="button" 
                    onClick={closeUploadModal} 
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add Billboard
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for detailed view (Not implemented here, you can expand as needed) */}
      {isModalOpen && selectedBillboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4">Billboard Details</h2>
            
            {/* Display billboard details here */}
            <p><strong>Type:</strong> {selectedBillboard.type}</p>
            <p><strong>Dimensions:</strong> {selectedBillboard.dimensions}</p>
            <p><strong>Status:</strong> {selectedBillboard.status}</p>
            <p><strong>Visibility:</strong> {selectedBillboard.visibility}</p>
            {/* Add more fields as needed */}
            
            <button 
              onClick={closeDetailModal}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billboard;
