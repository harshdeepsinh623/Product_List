import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Save, X } from 'lucide-react';

// API service for product operations
const productApi = {
  // Fetch products with optional filtering, sorting, and pagination
  async getProducts(page = 1, limit = 5, filters = {}, sort = { field: 'id', direction: 'asc' }) {
    try {
      // In a real app, we'd encode these parameters in the URL
      const response = await fetch('https://fakestoreapi.com/products');
      let data = await response.json();
      
      // Apply filtering
      if (filters.category && filters.category !== 'all') {
        data = data.filter(product => product.category === filters.category);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        data = data.filter(product => 
          product.title.toLowerCase().includes(searchTerm) || 
          product.description.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.minPrice) {
        data = data.filter(product => product.price >= filters.minPrice);
      }
      
      if (filters.maxPrice) {
        data = data.filter(product => product.price <= filters.maxPrice);
      }
      
      // Apply sorting
      data.sort((a, b) => {
        if (sort.direction === 'asc') {
          return a[sort.field] > b[sort.field] ? 1 : -1;
        } else {
          return a[sort.field] < b[sort.field] ? 1 : -1;
        }
      });
      
      // Apply pagination
      const totalItems = data.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const paginatedData = data.slice(startIndex, startIndex + limit);
      
      return {
        products: paginatedData,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages
        }
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  
  async getCategories() {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
  
  async deleteProduct(id) {
    try {
      // In a real app, we'd make a DELETE request
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
  
  async updateProduct(id, productData) {
    try {
      // In a real app, we'd make a PUT request
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },
  
  async addProduct(productData) {
    try {
      // In a real app, we'd make a POST request
      const response = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      return await response.json();
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }
};

// Product Form component for adding/editing products
const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    price: product?.price || '',
    description: product?.description || '',
    category: product?.category || '',
    image: product?.image || 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <button 
          onClick={onCancel} 
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows="3"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <Save size={16} className="mr-2" />
            {product ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Product Card component
const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg">
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img 
          src={product.image || "/api/placeholder/200/200"} 
          alt={product.title}
          className="w-full h-full object-contain p-2"
          onError={(e) => {
            e.target.src = "/api/placeholder/200/200";
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate">{product.title}</h3>
        <p className="text-blue-600 font-bold mb-2">${product.price.toFixed(2)}</p>
        <div className="mb-3">
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <button 
            onClick={() => onEdit(product)} 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Edit size={16} className="mr-1" />
            Edit
          </button>
          <button 
            onClick={() => onDelete(product.id)} 
            className="text-red-600 hover:text-red-800 flex items-center"
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Filter panel component
const FilterPanel = ({ filters, setFilters, categories }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => setFilters({
                ...filters, 
                minPrice: e.target.value ? parseFloat(e.target.value) : ''
              })}
              placeholder="Min"
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({
                ...filters, 
                maxPrice: e.target.value ? parseFloat(e.target.value) : ''
              })}
              placeholder="Max"
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// ProductImagePreview component to show preview of uploaded image
const ProductImagePreview = ({ src }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };
  
  return (
    <div className="mt-2 border rounded overflow-hidden h-40 bg-gray-100 flex items-center justify-center">
      {isLoading && (
        <div className="text-center text-gray-500">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-gray-400 border-r-transparent"></div>
          <p className="mt-1 text-sm">Loading preview...</p>
        </div>
      )}
      {error ? (
        <div className="text-center text-gray-500">
          <p>Image preview not available</p>
        </div>
      ) : (
        <img
          src={src || "/api/placeholder/200/200"}
          alt="Product preview"
          className={`w-full h-full object-contain ${isLoading ? 'hidden' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

const DataTable = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  // Generate products data with specific products
  const generateProducts = () => {
    const productsData = [
      { name: 'Apple iMac', category: 'Computers', brand: 'Apple', price: 1299, stock: 50, totalSales: 200, status: 'In Stock' },
      { name: 'Apple iPhone', category: 'Mobile Phones', brand: 'Apple', price: 999, stock: 120, totalSales: 300, status: 'In Stock' },
      { name: 'Samsung Galaxy', category: 'Mobile Phones', brand: 'Samsung', price: 899, stock: 80, totalSales: 150, status: 'In Stock' },
      { name: 'Dell XPS 13', category: 'Computers', brand: 'Dell', price: 1099, stock: 30, totalSales: 120, status: 'Out of Stock' },
      { name: 'HP Spectre x360', category: 'Computers', brand: 'HP', price: 1299, stock: 25, totalSales: 80, status: 'Limited Stock' },
      { name: 'Google Pixel 6', category: 'Mobile Phones', brand: 'Google', price: 799, stock: 100, totalSales: 200, status: 'In Stock' },
      { name: 'Sony WH-1000XM4', category: 'Headphones', brand: 'Sony', price: 349, stock: 60, totalSales: 150, status: 'In Stock' },
      { name: 'Apple AirPods Pro', category: 'Headphones', brand: 'Apple', price: 249, stock: 200, totalSales: 300, status: 'In Stock' },
      { name: 'Asus ROG Zephyrus', category: 'Computers', brand: 'Asus', price: 1899, stock: 15, totalSales: 50, status: 'Out of Stock' },
      { name: 'Microsoft Surface Pro 7', category: 'Computers', brand: 'Microsoft', price: 899, stock: 40, totalSales: 100, status: 'In Stock' },
      { name: 'Samsung QLED TV', category: 'Televisions', brand: 'Samsung', price: 1299, stock: 25, totalSales: 70, status: 'Limited Stock' },
      { name: 'LG OLED TV', category: 'Televisions', brand: 'LG', price: 1499, stock: 20, totalSales: 50, status: 'Out of Stock' },
      { name: 'Canon EOS R5', category: 'Cameras', brand: 'Canon', price: 3899, stock: 10, totalSales: 30, status: 'Limited Stock' },
      { name: 'Nikon Z7 II', category: 'Cameras', brand: 'Nikon', price: 3299, stock: 8, totalSales: 25, status: 'Out of Stock' },
      { name: 'Apple Watch Series 7', category: 'Wearables', brand: 'Apple', price: 399, stock: 150, totalSales: 500, status: 'In Stock' },
      { name: 'Fitbit Charge 5', category: 'Wearables', brand: 'Fitbit', price: 179, stock: 100, totalSales: 250, status: 'Limited Stock' },
      { name: 'Dyson V11 Vacuum', category: 'Home Appliances', brand: 'Dyson', price: 599, stock: 30, totalSales: 90, status: 'In Stock' },
      { name: 'iRobot Roomba i7+', category: 'Home Appliances', brand: 'iRobot', price: 799, stock: 20, totalSales: 70, status: 'Out of Stock' },
      { name: 'Bose SoundLink Revolve', category: 'Speakers', brand: 'Bose', price: 199, stock: 80, totalSales: 200, status: 'In Stock' },
      { name: 'Sonos One', category: 'Speakers', brand: 'Sonos', price: 219, stock: 60, totalSales: 180, status: 'In Stock' },
      { name: 'Apple iPad Pro', category: 'Tablets', brand: 'Apple', price: 1099, stock: 50, totalSales: 150, status: 'In Stock' },
      { name: 'Samsung Galaxy Tab S7', category: 'Tablets', brand: 'Samsung', price: 649, stock: 70, totalSales: 130, status: 'In Stock' },
      { name: 'Amazon Echo Dot', category: 'Smart Home', brand: 'Amazon', price: 49, stock: 300, totalSales: 800, status: 'In Stock' },
      { name: 'Google Nest Hub', category: 'Smart Home', brand: 'Google', price: 89, stock: 150, totalSales: 400, status: 'In Stock' },
      { name: 'PlayStation 5', category: 'Gaming Consoles', brand: 'Sony', price: 499, stock: 10, totalSales: 500, status: 'Out of Stock' },
      { name: 'Xbox Series X', category: 'Gaming Consoles', brand: 'Microsoft', price: 499, stock: 15, totalSales: 450, status: 'Out of Stock' },
      { name: 'Nintendo Switch', category: 'Gaming Consoles', brand: 'Nintendo', price: 299, stock: 40, totalSales: 600, status: 'In Stock' },
      { name: 'Apple MacBook Pro', category: 'Computers', brand: 'Apple', price: 1299, stock: 20, totalSales: 100, status: 'In Stock' },
      { name: 'Razer Blade 15', category: 'Gaming Laptops', brand: 'Razer', price: 1999, stock: 25, totalSales: 120, status: 'Out of Stock' },
      { name: 'MSI GE76 Raider', category: 'Gaming Laptops', brand: 'MSI', price: 2499, stock: 15, totalSales: 80, status: 'Out of Stock' },
      { name: 'Alienware m17', category: 'Gaming Laptops', brand: 'Dell', price: 2299, stock: 20, totalSales: 90, status: 'Out of Stock' },
      { name: 'Sony A7 III', category: 'Cameras', brand: 'Sony', price: 1999, stock: 30, totalSales: 150, status: 'In Stock' },
      { name: 'Fujifilm X-T4', category: 'Cameras', brand: 'Fujifilm', price: 1699, stock: 25, totalSales: 100, status: 'In Stock' },
      { name: 'Samsung Galaxy Watch 4', category: 'Wearables', brand: 'Samsung', price: 249, stock: 100, totalSales: 300, status: 'In Stock' },
      { name: 'Garmin Fenix 7', category: 'Wearables', brand: 'Garmin', price: 699, stock: 40, totalSales: 120, status: 'In Stock' },
      { name: 'LG Gram 17', category: 'Laptops', brand: 'LG', price: 1499, stock: 30, totalSales: 80, status: 'Out of Stock' },
      { name: 'Lenovo ThinkPad X1', category: 'Laptops', brand: 'Lenovo', price: 1399, stock: 45, totalSales: 150, status: 'In Stock' },
      { name: 'Acer Predator', category: 'Gaming Monitors', brand: 'Acer', price: 699, stock: 35, totalSales: 100, status: 'In Stock' },
      { name: 'ASUS ROG Swift', category: 'Gaming Monitors', brand: 'ASUS', price: 799, stock: 25, totalSales: 75, status: 'Limited Stock' },
      { name: 'Samsung Odyssey G9', category: 'Gaming Monitors', brand: 'Samsung', price: 1299, stock: 15, totalSales: 50, status: 'Limited Stock' },
      { name: 'Logitech G Pro X', category: 'Gaming Peripherals', brand: 'Logitech', price: 129, stock: 150, totalSales: 400, status: 'In Stock' },
      { name: 'Razer DeathAdder V2', category: 'Gaming Peripherals', brand: 'Razer', price: 69, stock: 200, totalSales: 600, status: 'In Stock' },
      { name: 'SteelSeries Apex Pro', category: 'Gaming Peripherals', brand: 'SteelSeries', price: 199, stock: 100, totalSales: 300, status: 'In Stock' },
      { name: 'iPhone 13 Pro Max', category: 'Smartphones', brand: 'Apple', price: 1099, stock: 50, totalSales: 200, status: 'In Stock' },
      { name: 'Samsung S22 Ultra', category: 'Smartphones', brand: 'Samsung', price: 1199, stock: 45, totalSales: 180, status: 'In Stock' },
      { name: 'Google Pixel 7 Pro', category: 'Smartphones', brand: 'Google', price: 899, stock: 40, totalSales: 150, status: 'Out of Stock' },
      { name: 'OnePlus 10 Pro', category: 'Smartphones', brand: 'OnePlus', price: 899, stock: 35, totalSales: 130, status: 'Out of Stock' },
      { name: 'iPad Air', category: 'Tablets', brand: 'Apple', price: 599, stock: 80, totalSales: 250, status: 'In Stock' },
      { name: 'Surface Pro 8', category: 'Tablets', brand: 'Microsoft', price: 999, stock: 40, totalSales: 120, status: 'Limited Stock' },
      { name: 'Galaxy Tab S8', category: 'Tablets', brand: 'Samsung', price: 699, stock: 60, totalSales: 180, status: 'In Stock' },
      { name: 'DJI Mavic 3', category: 'Drones', brand: 'DJI', price: 2199, stock: 20, totalSales: 60, status: 'Limited Stock' },
      { name: 'DJI Mini 3 Pro', category: 'Drones', brand: 'DJI', price: 759, stock: 40, totalSales: 120, status: 'In Stock' },
      { name: 'GoPro Hero 10', category: 'Action Cameras', brand: 'GoPro', price: 499, stock: 70, totalSales: 200, status: 'In Stock' },
      { name: 'DJI Action 2', category: 'Action Cameras', brand: 'DJI', price: 399, stock: 50, totalSales: 150, status: 'Out of Stock' },
      { name: 'Insta360 ONE RS', category: 'Action Cameras', brand: 'Insta360', price: 299, stock: 40, totalSales: 100, status: 'Out of Stock' },
      { name: 'MacBook Air M2', category: 'Laptops', brand: 'Apple', price: 1199, stock: 60, totalSales: 200, status: 'In Stock' },
      { name: 'Dell XPS 15', category: 'Laptops', brand: 'Dell', price: 1699, stock: 35, totalSales: 100, status: 'Out of Stock' },
      { name: 'ASUS ZenBook Pro', category: 'Laptops', brand: 'ASUS', price: 1499, stock: 30, totalSales: 90, status: 'Out of Stock' },
      { name: 'Logitech MX Master 3', category: 'Peripherals', brand: 'Logitech', price: 99, stock: 120, totalSales: 350, status: 'In Stock' },
      { name: 'Keychron K2', category: 'Peripherals', brand: 'Keychron', price: 79, stock: 100, totalSales: 300, status: 'In Stock' },
      { name: 'Samsung 980 Pro', category: 'Storage', brand: 'Samsung', price: 179, stock: 150, totalSales: 400, status: 'In Stock' },
      { name: 'WD Black SN850', category: 'Storage', brand: 'Western Digital', price: 169, stock: 130, totalSales: 350, status: 'In Stock' },
      { name: 'Crucial P5', category: 'Storage', brand: 'Crucial', price: 149, stock: 120, totalSales: 300, status: 'In Stock' },
      { name: 'RTX 4090', category: 'Graphics Cards', brand: 'NVIDIA', price: 1599, stock: 10, totalSales: 50, status: 'Limited Stock' },
      { name: 'RX 6950 XT', category: 'Graphics Cards', brand: 'AMD', price: 1099, stock: 15, totalSales: 60, status: 'Limited Stock' },
      { name: 'RTX 4080', category: 'Graphics Cards', brand: 'NVIDIA', price: 1199, stock: 20, totalSales: 80, status: 'Out of Stock' },
      { name: 'Ryzen 9 7950X', category: 'Processors', brand: 'AMD', price: 699, stock: 30, totalSales: 100, status: 'Out of Stock' },
      { name: 'Core i9-13900K', category: 'Processors', brand: 'Intel', price: 589, stock: 35, totalSales: 120, status: 'Out of Stock' },
      { name: 'Ryzen 7 7700X', category: 'Processors', brand: 'AMD', price: 399, stock: 50, totalSales: 150, status: 'Out of Stock' },
      // Adding more products
      { name: 'Razer Blade 15', category: 'Gaming Laptops', brand: 'Razer', price: 1999, stock: 25, totalSales: 120, status: 'In Stock' },
      { name: 'MSI GE76 Raider', category: 'Gaming Laptops', brand: 'MSI', price: 2499, stock: 15, totalSales: 80, status: 'In Stock' },
      { name: 'Alienware m17', category: 'Gaming Laptops', brand: 'Dell', price: 2299, stock: 20, totalSales: 90, status: 'In Stock' },
      { name: 'Sony A7 III', category: 'Cameras', brand: 'Sony', price: 1999, stock: 30, totalSales: 150, status: 'In Stock' },
      { name: 'Fujifilm X-T4', category: 'Cameras', brand: 'Fujifilm', price: 1699, stock: 25, totalSales: 100, status: 'In Stock' },
      { name: 'Samsung Galaxy Watch 4', category: 'Wearables', brand: 'Samsung', price: 249, stock: 100, totalSales: 300, status: 'In Stock' },
      { name: 'Garmin Fenix 7', category: 'Wearables', brand: 'Garmin', price: 699, stock: 40, totalSales: 120, status: 'In Stock' },
      { name: 'LG Gram 17', category: 'Laptops', brand: 'LG', price: 1499, stock: 30, totalSales: 80, status: 'In Stock' },
      { name: 'Lenovo ThinkPad X1', category: 'Laptops', brand: 'Lenovo', price: 1399, stock: 45, totalSales: 150, status: 'In Stock' },
      { name: 'Acer Predator', category: 'Gaming Monitors', brand: 'Acer', price: 699, stock: 35, totalSales: 100, status: 'In Stock' },
      { name: 'ASUS ROG Swift', category: 'Gaming Monitors', brand: 'ASUS', price: 799, stock: 25, totalSales: 75, status: 'In Stock' },
      { name: 'Samsung Odyssey G9', category: 'Gaming Monitors', brand: 'Samsung', price: 1299, stock: 15, totalSales: 50, status: 'In Stock' },
      { name: 'Logitech G Pro X', category: 'Gaming Peripherals', brand: 'Logitech', price: 129, stock: 150, totalSales: 400, status: 'In Stock' },
      { name: 'Razer DeathAdder V2', category: 'Gaming Peripherals', brand: 'Razer', price: 69, stock: 200, totalSales: 600, status: 'In Stock' },
      { name: 'SteelSeries Apex Pro', category: 'Gaming Peripherals', brand: 'SteelSeries', price: 199, stock: 100, totalSales: 300, status: 'In Stock' },
      { name: 'iPhone 13 Pro Max', category: 'Smartphones', brand: 'Apple', price: 1099, stock: 50, totalSales: 200, status: 'In Stock' },
      { name: 'Samsung S22 Ultra', category: 'Smartphones', brand: 'Samsung', price: 1199, stock: 45, totalSales: 180, status: 'In Stock' },
      { name: 'Google Pixel 7 Pro', category: 'Smartphones', brand: 'Google', price: 899, stock: 40, totalSales: 150, status: 'In Stock' },
      { name: 'OnePlus 10 Pro', category: 'Smartphones', brand: 'OnePlus', price: 899, stock: 35, totalSales: 130, status: 'In Stock' },
      { name: 'iPad Air', category: 'Tablets', brand: 'Apple', price: 599, stock: 80, totalSales: 250, status: 'In Stock' },
      { name: 'Surface Pro 8', category: 'Tablets', brand: 'Microsoft', price: 999, stock: 40, totalSales: 120, status: 'In Stock' },
      { name: 'Galaxy Tab S8', category: 'Tablets', brand: 'Samsung', price: 699, stock: 60, totalSales: 180, status: 'In Stock' },
      { name: 'DJI Mavic 3', category: 'Drones', brand: 'DJI', price: 2199, stock: 20, totalSales: 60, status: 'In Stock' },
      { name: 'DJI Mini 3 Pro', category: 'Drones', brand: 'DJI', price: 759, stock: 40, totalSales: 120, status: 'In Stock' },
      { name: 'GoPro Hero 10', category: 'Action Cameras', brand: 'GoPro', price: 499, stock: 70, totalSales: 200, status: 'In Stock' },
      { name: 'DJI Action 2', category: 'Action Cameras', brand: 'DJI', price: 399, stock: 50, totalSales: 150, status: 'In Stock' },
      { name: 'Insta360 ONE RS', category: 'Action Cameras', brand: 'Insta360', price: 299, stock: 40, totalSales: 100, status: 'In Stock' },
      { name: 'MacBook Air M2', category: 'Laptops', brand: 'Apple', price: 1199, stock: 60, totalSales: 200, status: 'In Stock' },
      { name: 'Dell XPS 15', category: 'Laptops', brand: 'Dell', price: 1699, stock: 35, totalSales: 100, status: 'In Stock' },
      { name: 'ASUS ZenBook Pro', category: 'Laptops', brand: 'ASUS', price: 1499, stock: 30, totalSales: 90, status: 'In Stock' },
      { name: 'Logitech MX Master 3', category: 'Peripherals', brand: 'Logitech', price: 99, stock: 120, totalSales: 350, status: 'In Stock' },
      { name: 'Keychron K2', category: 'Peripherals', brand: 'Keychron', price: 79, stock: 100, totalSales: 300, status: 'In Stock' },
      { name: 'Samsung 980 Pro', category: 'Storage', brand: 'Samsung', price: 179, stock: 150, totalSales: 400, status: 'In Stock' },
      { name: 'WD Black SN850', category: 'Storage', brand: 'Western Digital', price: 169, stock: 130, totalSales: 350, status: 'In Stock' },
      { name: 'Crucial P5', category: 'Storage', brand: 'Crucial', price: 149, stock: 120, totalSales: 300, status: 'In Stock' },
      { name: 'RTX 4090', category: 'Graphics Cards', brand: 'NVIDIA', price: 1599, stock: 10, totalSales: 50, status: 'Limited Stock' },
      { name: 'RX 6950 XT', category: 'Graphics Cards', brand: 'AMD', price: 1099, stock: 15, totalSales: 60, status: 'Limited Stock' },
      { name: 'RTX 4080', category: 'Graphics Cards', brand: 'NVIDIA', price: 1199, stock: 20, totalSales: 80, status: 'In Stock' },
      { name: 'Ryzen 9 7950X', category: 'Processors', brand: 'AMD', price: 699, stock: 30, totalSales: 100, status: 'In Stock' },
      { name: 'Core i9-13900K', category: 'Processors', brand: 'Intel', price: 589, stock: 35, totalSales: 120, status: 'In Stock' },
      { name: 'Ryzen 7 7700X', category: 'Processors', brand: 'AMD', price: 399, stock: 50, totalSales: 150, status: 'In Stock' },
      // Adding 31 more products
      { name: 'Intel Core i5-13600K', category: 'Processors', brand: 'Intel', price: 319, stock: 45, totalSales: 180, status: 'In Stock' },
      { name: 'Ryzen 5 7600X', category: 'Processors', brand: 'AMD', price: 299, stock: 55, totalSales: 200, status: 'In Stock' },
      { name: 'ROG Strix B650-E', category: 'Motherboards', brand: 'ASUS', price: 349, stock: 30, totalSales: 85, status: 'In Stock' },
      { name: 'MSI MPG B760', category: 'Motherboards', brand: 'MSI', price: 199, stock: 40, totalSales: 120, status: 'In Stock' },
      { name: 'Corsair Dominator', category: 'RAM', brand: 'Corsair', price: 199, stock: 75, totalSales: 250, status: 'In Stock' },
      { name: 'G.Skill Trident Z5', category: 'RAM', brand: 'G.Skill', price: 219, stock: 60, totalSales: 180, status: 'In Stock' },
      { name: 'NZXT H510 Flow', category: 'PC Cases', brand: 'NZXT', price: 89, stock: 50, totalSales: 150, status: 'In Stock' },
      { name: 'Lian Li O11D EVO', category: 'PC Cases', brand: 'Lian Li', price: 169, stock: 35, totalSales: 100, status: 'In Stock' },
      { name: 'Corsair HX1000i', category: 'Power Supplies', brand: 'Corsair', price: 239, stock: 45, totalSales: 130, status: 'In Stock' },
      { name: 'EVGA SuperNOVA 850', category: 'Power Supplies', brand: 'EVGA', price: 149, stock: 55, totalSales: 160, status: 'In Stock' },
      { name: 'Arctic Liquid Freezer II', category: 'CPU Coolers', brand: 'Arctic', price: 119, stock: 40, totalSales: 110, status: 'In Stock' },
      { name: 'NZXT Kraken X53', category: 'CPU Coolers', brand: 'NZXT', price: 129, stock: 35, totalSales: 95, status: 'In Stock' },
      { name: 'LG 27GP950-B', category: 'Gaming Monitors', brand: 'LG', price: 899, stock: 20, totalSales: 60, status: 'In Stock' },
      { name: 'Alienware AW3423DW', category: 'Gaming Monitors', brand: 'Dell', price: 1299, stock: 15, totalSales: 45, status: 'Limited Stock' },
      { name: 'AudioTechnica ATH-M50x', category: 'Headphones', brand: 'AudioTechnica', price: 149, stock: 90, totalSales: 280, status: 'In Stock' },
      { name: 'Sennheiser HD 660S', category: 'Headphones', brand: 'Sennheiser', price: 499, stock: 30, totalSales: 85, status: 'In Stock' },
      { name: 'Blue Yeti X', category: 'Microphones', brand: 'Blue', price: 169, stock: 65, totalSales: 190, status: 'In Stock' },
      { name: 'Shure SM7B', category: 'Microphones', brand: 'Shure', price: 399, stock: 25, totalSales: 70, status: 'In Stock' },
      { name: 'Elgato Stream Deck XL', category: 'Streaming Gear', brand: 'Elgato', price: 249, stock: 40, totalSales: 120, status: 'In Stock' },
      { name: 'AVerMedia Live Gamer 4K', category: 'Streaming Gear', brand: 'AVerMedia', price: 299, stock: 30, totalSales: 85, status: 'In Stock' },
      { name: 'Razer Huntsman V2', category: 'Gaming Keyboards', brand: 'Razer', price: 199, stock: 70, totalSales: 210, status: 'In Stock' },
      { name: 'Corsair K100 RGB', category: 'Gaming Keyboards', brand: 'Corsair', price: 229, stock: 55, totalSales: 165, status: 'In Stock' },
      { name: 'Logitech G502 X PLUS', category: 'Gaming Mice', brand: 'Logitech', price: 159, stock: 85, totalSales: 255, status: 'In Stock' },
      { name: 'Razer Viper V2 Pro', category: 'Gaming Mice', brand: 'Razer', price: 149, stock: 75, totalSales: 225, status: 'In Stock' },
      { name: 'Secretlab Titan Evo', category: 'Gaming Chairs', brand: 'Secretlab', price: 549, stock: 25, totalSales: 75, status: 'In Stock' },
      { name: 'Herman Miller Embody', category: 'Gaming Chairs', brand: 'Herman Miller', price: 1695, stock: 10, totalSales: 30, status: 'Limited Stock' },
      { name: 'Oculus Quest 3', category: 'VR Headsets', brand: 'Meta', price: 499, stock: 45, totalSales: 135, status: 'In Stock' },
      { name: 'Valve Index', category: 'VR Headsets', brand: 'Valve', price: 999, stock: 20, totalSales: 60, status: 'In Stock' },
      { name: 'Xbox Elite Controller 2', category: 'Game Controllers', brand: 'Microsoft', price: 179, stock: 50, totalSales: 150, status: 'In Stock' },
      { name: 'PS5 DualSense Edge', category: 'Game Controllers', brand: 'Sony', price: 199, stock: 45, totalSales: 135, status: 'In Stock' },
      { name: 'Seagate FireCuda 530 2TB', category: 'Storage', brand: 'Seagate', price: 259, stock: 65, totalSales: 195, status: 'In Stock' }
    ];

    // Add IDs to the products and return them sorted by brand
    return productsData.map((product, index) => ({
      id: index + 1,
      ...product
    })).sort((a, b) => a.brand.localeCompare(b.brand));
  };

  // Rest of the component remains the same...
  const [data] = useState(generateProducts());
  const [sortConfig, setSortConfig] = useState({ key: 'brand', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [columns, setColumns] = useState([
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'brand', label: 'Brand' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
    { key: 'totalSales', label: 'Total Sales' },
    { key: 'status', label: 'Status' }
  ]);
  const itemsPerPage = 10;

  // Get unique categories
  const categories = ['all', ...new Set(data.map(item => item.category))];

  // Move column left
  const moveColumnLeft = (index) => {
    if (index > 0) {
      const newColumns = [...columns];
      [newColumns[index - 1], newColumns[index]] = [newColumns[index], newColumns[index - 1]];
      setColumns(newColumns);
    }
  };

  // Move column right
  const moveColumnRight = (index) => {
    if (index < columns.length - 1) {
      const newColumns = [...columns];
      [newColumns[index], newColumns[index + 1]] = [newColumns[index + 1], newColumns[index]];
      setColumns(newColumns);
    }
  };

  // Sorting function
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort data
  const filteredAndSortedData = data
    .filter(item => {
      const searchFields = [item.name, item.category, item.brand, item.status].join(' ').toLowerCase();
      const matchesSearch = searchFields.includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Render sort indicator - only show down arrow for descending
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <div className="w-4" />;
    return sortConfig.direction === 'desc' ? <ChevronDown size={16} /> : null;
  };

  return (
    <div className="p-4">
      {/* Theme Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            isDarkTheme ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          {isDarkTheme ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className={`overflow-x-auto relative shadow-md sm:rounded-lg ${
        isDarkTheme ? 'bg-gray-800' : 'bg-white'
      }`}>
        <table className="w-full text-sm text-left">
          <thead className={`text-xs uppercase ${
            isDarkTheme 
              ? 'bg-gray-700 text-gray-100' 
              : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
          }`}>
            <tr>
              {columns.map((column, index) => (
                <th key={column.key} 
                    className={`px-6 py-3 cursor-pointer transition-colors duration-200 ${
                      isDarkTheme ? 'hover:bg-gray-600' : 'hover:bg-blue-700'
                    }`}
                    onClick={() => sortData(column.key)}
                >
                  <div className="flex items-center justify-between">
                    {column.label}
                    {renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={item.id} 
                  className={`border-b ${
                    isDarkTheme
                      ? idx % 2 === 0 
                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                        : 'bg-gray-700 border-gray-700 hover:bg-gray-600'
                      : idx % 2 === 0 
                        ? 'bg-white hover:bg-blue-50' 
                        : 'bg-gray-50 hover:bg-blue-50'
                  } transition-colors duration-200`}
              >
                {columns.map(column => (
                  <td key={`${item.id}-${column.key}`} 
                      className={`px-6 py-4 ${isDarkTheme ? 'text-gray-200' : ''}`}
                  >
                    {column.key === 'price' ? (
                      <span className={`font-semibold ${
                        isDarkTheme ? 'text-green-400' : 'text-green-600'
                      }`}>
                        ${item[column.key].toLocaleString()}
                      </span>
                    ) : column.key === 'status' ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'In Stock' 
                          ? isDarkTheme ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                          : item.status === 'Out of Stock' 
                          ? isDarkTheme ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
                          : isDarkTheme ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item[column.key]}
                      </span>
                    ) : column.key === 'totalSales' ? (
                      <span className={`font-medium ${
                        isDarkTheme ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {item[column.key].toLocaleString()}
                      </span>
                    ) : column.key === 'stock' ? (
                      <span className={`font-medium ${
                        isDarkTheme
                          ? item.stock <= 20 ? 'text-red-400'
                            : item.stock <= 50 ? 'text-yellow-400'
                            : 'text-green-400'
                          : item.stock <= 20 ? 'text-red-600'
                            : item.stock <= 50 ? 'text-yellow-600'
                            : 'text-green-600'
                      }`}>
                        {item[column.key]}
                      </span>
                    ) : (
                      <span className={isDarkTheme ? 'text-gray-200' : 'text-gray-700'}>
                        {item[column.key]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, index) => {
            // Show first 3 pages, current page, and last 3 pages
            if (
              index === 0 ||
              index === totalPages - 1 ||
              (index >= currentPage - 2 && index <= currentPage + 2)
            ) {
              return (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              );
            } else if (
              index === currentPage - 3 ||
              index === currentPage + 3
            ) {
              return <span key={index} className="px-2">...</span>;
            }
            return null;
          })}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="relative text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Product Management
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full"></div>
          </div>
        </div>
        <div className="text-sm text-gray-500 text-center mb-4">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <DataTable />
      </div>
    </div>
  );
}