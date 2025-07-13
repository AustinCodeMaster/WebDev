import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Authentication services
export const authService = {
  // Login user
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};

// Items services
export const itemsService = {
  // Get all items
  getAllItems: async () => {
    try {
      const response = await apiClient.get('/items');
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },
  
  // Get item by ID
  getItemById: async (id) => {
    try {
      const response = await apiClient.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching item with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Create new item
  createItem: async (itemData) => {
    try {
      const response = await apiClient.post('/items', itemData);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },
  
  // Update item
  updateItem: async (id, itemData) => {
    try {
      const response = await apiClient.put(`/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      console.error(`Error updating item with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete item
  deleteItem: async (id) => {
    try {
      const response = await apiClient.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting item with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Get dashboard stats
  getStats: async () => {
    try {
      const response = await apiClient.get('/items/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

// Create a named api object before exporting it
const api = {
  auth: authService,
  items: itemsService
};

export default api;
