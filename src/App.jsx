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

export default function ProductManagementApp() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    totalItems: 0,
    totalPages: 0
  });
  
  // Sorting state
  const [sort, setSort] = useState({ field: 'id', direction: 'asc' });
  
  // Filtering state
  const [filters, setFilters] = useState({});
  
  // Edit/Add product modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Load products and categories on initial render
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await productApi.getCategories();
        setCategories(categoriesData);
        
        // Fetch products with initial pagination, sorting, and filtering
        const { products: productsData, pagination: paginationData } = await productApi.getProducts(
          pagination.page,
          pagination.limit,
          filters,
          sort
        );
        
        setProducts(productsData);
        setPagination(paginationData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Fetch products when pagination, sorting, or filtering changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { products: productsData, pagination: paginationData } = await productApi.getProducts(
          pagination.page,
          pagination.limit,
          filters,
          sort
        );
        
        setProducts(productsData);
        setPagination(paginationData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [pagination.page, pagination.limit, filters, sort]);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };
  
  // Handle sorting
  const handleSort = (field) => {
    setSort(prevSort => ({
      field,
      direction: prevSort.field === field && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.deleteProduct(id);
        // Remove the product from local state
        setProducts(products.filter(product => product.id !== id));
        // Re-fetch products to ensure our pagination is correct
        const { products: productsData, pagination: paginationData } = await productApi.getProducts(
          pagination.page,
          pagination.limit,
          filters,
          sort
        );
        
        setProducts(productsData);
        setPagination(paginationData);
      } catch (err) {
        setError('Failed to delete product. Please try again later.');
      }
    }
  };
  
  // Handle opening the form for editing
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setIsFormOpen(true);
  };
  
  // Handle opening the form for adding
  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsFormOpen(true);
  };
  
  // Handle saving product (add or update)
  const handleSaveProduct = async (productData) => {
    try {
      if (currentProduct) {
        // Update existing product
        await productApi.updateProduct(currentProduct.id, {
          ...currentProduct,
          ...productData
        });
      } else {
        // Add new product
        await productApi.addProduct(productData);
      }
      
      // Close the form
      setIsFormOpen(false);
      
      // Refresh products
      const { products: productsData, pagination: paginationData } = await productApi.getProducts(
        pagination.page,
        pagination.limit,
        filters,
        sort
      );
      
      setProducts(productsData);
      setPagination(paginationData);
    } catch (err) {
      setError(`Failed to ${currentProduct ? 'update' : 'add'} product. Please try again later.`);
    }
  };
  
  // Handle closing the form
  const handleCancelForm = () => {
    setIsFormOpen(false);
  };
  
  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (sort.field !== field) return null;
    
    return sort.direction === 'asc' 
      ? <ChevronUp size={16} className="inline" />
      : <ChevronDown size={16} className="inline" />;
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6"></h1>
        
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left sidebar with filters */}
          <div className="md:col-span-1">
            <FilterPanel 
              filters={filters} 
              setFilters={setFilters} 
              categories={categories}
            />
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Products</h2>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add Product
                </button>
              </div>
              
              {/* Sorting options */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <button 
                    onClick={() => handleSort('id')}
                    className={`text-sm ${sort.field === 'id' ? 'font-semibold text-blue-600' : 'text-gray-600'}`}
                  >
                    ID {renderSortIndicator('id')}
                  </button>
                  <button 
                    onClick={() => handleSort('title')}
                    className={`text-sm ${sort.field === 'title' ? 'font-semibold text-blue-600' : 'text-gray-600'}`}
                  >
                    Name {renderSortIndicator('title')}
                  </button>
                  <button 
                    onClick={() => handleSort('price')}
                    className={`text-sm ${sort.field === 'price' ? 'font-semibold text-blue-600' : 'text-gray-600'}`}
                  >
                    Price {renderSortIndicator('price')}
                  </button>
                  <button 
                    onClick={() => handleSort('category')}
                    className={`text-sm ${sort.field === 'category' ? 'font-semibold text-blue-600' : 'text-gray-600'}`}
                  >
                    Category {renderSortIndicator('category')}
                  </button>
                </div>
              </div>
              
              {/* Products grid */}
              {loading ? (
                <div className="p-6 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600">No products found.</p>
                </div>
              ) : (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalItems)} of {pagination.totalItems} products
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`p-2 rounded ${pagination.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 rounded ${pagination.page === i + 1 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`p-2 rounded ${pagination.page === pagination.totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg">
            <ProductForm
              product={currentProduct}
              onSave={handleSaveProduct}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}