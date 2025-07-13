import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';
import '../../assets/css/Admin.css';

const AdminPage = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    claimed: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    date_lost: '',
    description: '',
    image: '',
    status: 'lost' // Always set to lost
  });
  

  // Load items and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch items
        const itemsResponse = await axios.get('http://localhost:3000/api/items');
        setItems(itemsResponse.data);
        
        // Calculate stats from items since we may not have a stats endpoint
        const total = itemsResponse.data.length;
        
        setStats({
          total,
          claimed: 0 // We're not using claimed status anymore
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // No need for image preview click handler anymore

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data with the new value
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    // No need for special handling of category changes anymore
    
    setFormData(updatedFormData);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data with image (use selected or default based on category)
    const submissionData = { ...formData };
    if (!submissionData.image || submissionData.image.trim() === '') {
      submissionData.image = getImageByCategory(submissionData.category);
    }
    
    try {
      // Add new item
      const response = await axios.post('http://localhost:3000/api/items', submissionData);
      
      // Update local state
      setItems([...items, response.data]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1
      }));
      
      // Reset form and close
      setFormData({
        name: '',
        category: '',
        location: '',
        date_lost: '',
        description: '',
        image: '',
        status: 'lost'
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item. Please try again.');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:3000/api/items/${id}`);
        
        // Update local state
        setItems(items.filter(item => item.id !== id));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total - 1
        }));
        
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
      }
    }
  };
  


  // Helper function to get default image based on category
  const getImageByCategory = (category) => {
    if (!category) return 'notebook.png';
    
    switch(category.toLowerCase()) {
      case 'electronics':
        return 'calculator.png';
      case 'clothing':
        return 'jacket.png';
      case 'accessories':
        return 'headphones.png';
      case 'documents':
        return 'notebook.png';
      case 'other':
        return 'waterbottle.png';
      default:
        return 'notebook.png';
    }
  };
  
  // No need for image preview related functions anymore

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="admin-page">
        <div className="container">
          <section className="admin-header">
            <h1>Admin Dashboard</h1>
            <p>Manage lost & found items efficiently</p>
          </section>

          <section className="admin-stats">
            <div className="stat-card">
              <i className="fas fa-box"></i>
              <h3>{stats.total}</h3>
              <p>Total Items</p>
            </div>
            
          </section>

          <section className="admin-content">
            <div className="admin-actions">
              <div className="admin-search">
                <input 
                  type="text" 
                  placeholder="Search items..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="add-item-btn" onClick={() => setShowAddForm(!showAddForm)}>
                <i className={`fas ${showAddForm ? 'fa-minus' : 'fa-plus'}`}></i> {showAddForm ? 'Hide Form' : 'Add New Item'}
              </button>
            </div>
            
            {/* Inline Add/Edit Form */}
            {showAddForm && (
              <div className="inline-form-container">
                <h2>Add Lost Item</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Item Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select
                      id="category"
                      name="category"
                      className="form-control"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Documents">Documents</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      className="form-control"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="date_lost">Date Lost:</label>
                    <input
                      type="date"
                      id="date_lost"
                      name="date_lost"
                      className="form-control"
                      value={formData.date_lost}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="image">Select Image:</label>
                    <select
                      id="image"
                      name="image"
                      className="form-control"
                      value={formData.image || ''}
                      onChange={handleChange}
                    >
                      <option value="">Default (Based on Category)</option>
                      <option value="calculator.png">Calculator</option>
                      <option value="jacket.png">Jacket</option>
                      <option value="headphones.png">Headphones</option>
                      <option value="notebook.png">Notebook</option>
                      <option value="usb.png">USB Drive</option>
                      <option value="laptop.png">Laptop</option>
                      <option value="waterbottle.png">Water Bottle</option>
                      <option value="umbrella.png">Umbrella</option>
                      <option value="charger.png">Charger</option>
                    </select>
                  </div>
                  

                  
                  <div className="form-buttons">
                    <button type="submit" className="submit-button" id="saveItemBtn">
                      Save Item
                    </button>
                    <button 
                      type="button" 
                      className="cancel-button"
                      id="cancelItemBtn"
                      onClick={() => {
                        setShowAddForm(false);
                        setFormData({
                          name: '',
                          category: '',
                          location: '',
                          date_lost: '',
                          description: '',
                          image: '',
                          status: 'lost'
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="loading">
                <i className="fas fa-spinner fa-spin"></i> Loading items...
              </div>
            ) : (
              <div className="items-table-container">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Date Lost</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center' }}>No items found</td>
                      </tr>
                    ) : (
                      filteredItems.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.category}</td>
                          <td>{item.location}</td>
                          <td>{formatDate(item.date_lost)}</td>
                          <td>
                            <span className="status-badge status-lost">
                              Lost
                            </span>
                          </td>
                          <td>
                            <div className="item-actions">
                              <button 
                                className="delete-btn"
                                onClick={() => handleDelete(item.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* No modal overlays needed */}
    </Layout>
  );
};

export default AdminPage;