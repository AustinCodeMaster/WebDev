import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';
import '../../assets/css/Home.css';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  
  // We no longer need user state in this component since the welcome message
  // is now handled by the Header component

  // Load items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/items');
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Handle search
  const handleSearch = () => {
    // Filter items based on search term and category
    // This is client-side filtering - in a real app, you might want to do this on the server
    return items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = category === '' || 
        item.category.toLowerCase() === category.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
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

  // Get appropriate icon for category
  const getCategoryIcon = (category) => {
    if (!category) return 'fa-tag';
    
    switch (category.toLowerCase()) {
      case 'electronics':
        return 'fa-microchip';
      case 'clothing':
        return 'fa-shirt';
      case 'accessories':
        return 'fa-glasses';
      case 'documents':
        return 'fa-file-lines';
      default:
        return 'fa-tag';
    }
  };

  // Get appropriate image for category
  const getImageByCategory = (item) => {
    if (item.image && item.image.trim() !== '') {
      return item.image;
    }
    
    if (!item.category) return 'notebook.png';
    
    switch(item.category.toLowerCase()) {
      case 'electronics':
        return 'calculator.png';
      case 'clothing':
        return 'jacket.png';
      case 'accessories':
        return 'headphones.png';
      case 'documents':
        return 'notebook.png';
      default:
        return 'notebook.png';
    }
  };

  const filteredItems = handleSearch();

  return (
    <Layout>
      {/* The welcome message is now in the Header component */}
      {/* Add search controls to the existing header */}
      <div className="search-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search items..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="documents">Documents</option>
            <option value="other">Other</option>
          </select>
          <button className="search-btn">Search</button>
        </div>
        
      </div>

      <section className="items-section">
        <div className="container">
          <h2>Lost Items</h2>
          {loading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i> Loading items...
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="no-items">No items found.</p>
          ) : (
            <div className="items-grid">
              {filteredItems.map(item => (
                <div className="item-card" key={item.id}>
                  <div className="item-image">
                    <img 
                      src={`${process.env.PUBLIC_URL}/images/${getImageByCategory(item)}`} 
                      alt={item.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${process.env.PUBLIC_URL}/images/notebook.png`;
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-category">
                      <i className={`fas ${getCategoryIcon(item.category)}`}></i> {item.category || 'Uncategorized'}
                    </p>
                    <p className="item-location">
                      <i className="fas fa-map-marker-alt"></i> {item.location || 'Unknown location'}
                    </p>
                    <p className="item-date">
                      <i className="fas fa-calendar-alt"></i> {formatDate(item.date_lost)}
                    </p>
                    <div className="item-status">
                      <span className={`status-badge status-${item.status}`}>
                        {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
