import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import  Button  from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Upload,
  X,
  Package,
  Eye
} from 'lucide-react';
import { productAPI, categoryAPI, specificationAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { normalProducts, salesProducts, newArrivalProducts } from '@/data/products';

const ProductManagement = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock: '',
    image: '',
    featured: false,
    sale_price: ''
  });

  const [specifications, setSpecifications] = useState([]);
  const [newSpec, setNewSpec] = useState({ name: '', value: '', price: '' });

  const commonSpecTypes = {
    'Size': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Color': ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Gray'],
    'Material': ['Cotton', 'Polyester', 'Wool', 'Silk', 'Denim', 'Leather'],
    'Brand': ['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo']
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      // Fetch specifications for each product
      const productsWithSpecs = await Promise.all(
        (response.data || []).map(async (product) => {
          try {
            const specsResponse = await specificationAPI.getAll();
            const productSpecs = specsResponse.data?.filter(spec => spec.product_id === product.id) || [];
            return { ...product, specifications: productSpecs };
          } catch (error) {
            return { ...product, specifications: [] };
          }
        })
      );
      setProducts(productsWithSpecs);
      setFilteredProducts(productsWithSpecs);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback to mock data if API fails
      loadMockProducts();
      toast({
        title: "Warning",
        description: "Using mock data - API connection failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback to default categories
      setCategories([
        { id: 1, name: 'men' },
        { id: 2, name: 'women' },
        { id: 3, name: 'kids' },
        { id: 4, name: 'accessories' }
      ]);
    }
  };

  // Load mock products data
  const loadMockProducts = () => {
    setLoading(true);
    // Combine all mock products and transform to match expected format
    const allMockProducts = [...normalProducts, ...salesProducts, ...newArrivalProducts].map(product => ({
      id: product.id,
      name: product.name,
      description: `${product.brand} - Premium quality ${product.category} item with ${product.rating} star rating`,
      price: product.salePrice || product.price,
      sale_price: product.salePrice ? product.price : null,
      category: product.category,
      stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
      image: product.image,
      sizes: product.sizes,
      colors: product.colors,
      featured: Math.random() > 0.7, // 30% chance of being featured
      brand: product.brand,
      rating: product.rating,
      reviews: product.reviews
    }));
    
    setProducts(allMockProducts);
    setFilteredProducts(allMockProducts);
    setLoading(false);
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSpecification = () => {
    if (!newSpec.name || !newSpec.value) {
      toast({
        title: "Validation Error",
        description: "Specification name and value are required",
        variant: "destructive",
      });
      return;
    }

    const spec = {
      ...newSpec,
      price: parseFloat(newSpec.price) || 0,
      id: Date.now() // Temporary ID for new specs
    };

    setSpecifications(prev => [...prev, spec]);
    setNewSpec({ name: '', value: '', price: '' });
  };

  const handleRemoveSpecification = (index) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuickAddSpec = (type, value) => {
    const spec = {
      name: type,
      value: value,
      price: 0,
      id: Date.now()
    };
    setSpecifications(prev => [...prev, spec]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name || formData.name.length > 150) {
      errors.name = 'Name is required and must be less than 150 characters';
    }
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errors.price = 'Price is required and must be a positive number';
    }
    
    if (!formData.category_id) {
      errors.category_id = 'Category is required';
    }
    
    if (formData.stock && (isNaN(formData.stock) || parseInt(formData.stock) < 0)) {
      errors.stock = 'Stock must be a positive integer';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    if (!validateForm()) {
      const errorMessages = Object.values(formErrors).join('. ');
      toast({
        title: "Validation Error",
        description: errorMessages || "Please fix the form errors before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        stock: formData.stock ? parseInt(formData.stock) : null,
        description: formData.description || null
      };

      const productResponse = await productAPI.create(productData);
      const productId = productResponse.data.id;

      // Create specifications for the new product
      for (const spec of specifications) {
        await specificationAPI.create({
          product_id: productId,
          name: spec.name,
          value: spec.value,
          price: spec.price
        });
      }

      toast({
        title: "Success",
        description: "Product and specifications added successfully",
      });
      setIsAddModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Failed to add product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add product';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    if (!validateForm()) {
      const errorMessages = Object.values(formErrors).join('. ');
      toast({
        title: "Validation Error",
        description: errorMessages || "Please fix the form errors before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        stock: formData.stock ? parseInt(formData.stock) : null,
        description: formData.description || null
      };

      await productAPI.update(selectedProduct.id, productData);

      // Delete existing specifications
      const existingSpecs = selectedProduct.specifications || [];
      for (const spec of existingSpecs) {
        await specificationAPI.delete(spec.id);
      }

      // Create new specifications
      for (const spec of specifications) {
        await specificationAPI.create({
          product_id: selectedProduct.id,
          name: spec.name,
          value: spec.value,
          price: spec.price
        });
      }

      toast({
        title: "Success",
        description: "Product and specifications updated successfully",
      });
      setIsEditModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await productAPI.delete(deleteProductId);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      setDeleteProductId(null);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category_id: product.category_id || product.category?.id || '',
      stock: product.stock || '',
      image: product.image || '',
      featured: product.featured || false,
      sale_price: product.sale_price || ''
    });
    setSpecifications(product.specifications || []);
    setImagePreview(product.image);
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      stock: '',
      image: '',
      featured: false,
      sale_price: ''
    });
    setSpecifications([]);
    setNewSpec({ name: '', value: '', price: '' });
    setImagePreview('');
    setSelectedProduct(null);
    setFormErrors({});
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className=" w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id || cat} value={cat.id || cat}>
                {cat.name || cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription className="dark:bg-gray-900" >
                Fill in the product details below
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              formData={formData}
              imagePreview={imagePreview}
              categories={categories}
              specifications={specifications}
              newSpec={newSpec}
              setNewSpec={setNewSpec}
              commonSpecTypes={commonSpecTypes}
              handleInputChange={handleInputChange}
              handleImageUpload={handleImageUpload}
              handleAddSpecification={handleAddSpecification}
              handleRemoveSpecification={handleRemoveSpecification}
              handleQuickAddSpec={handleQuickAddSpec}
              onSubmit={handleAddProduct}
              onCancel={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              formErrors={formErrors}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center animate-fade-in animation-delay-150">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? "Try adjusting your filters" 
              : "Start by adding your first product"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className="overflow-hidden dark:bg-gray-900 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${150 + index * 100}ms` }}
            >
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.featured && (
                  <span className="absolute top-2 left-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Featured
                  </span>
                )}
                {product.sale_price && (
                  <span className="absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    Sale
                  </span>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-1">{product.name}</h4>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold">${product.price}</span>
                    {product.sale_price && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ${product.sale_price}
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {product.category?.name || product.category || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span>Stock: {product.stock}</span>
                  <span>SKU: #{product.id}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-orange-200 dark:border-gray-700 hover:bg-orange-100/50 dark:hover:bg-gray-800/50"
                    onClick={() => openEditModal(product)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 "
                    onClick={() => setDeleteProductId(product.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details below
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            formData={formData}
            imagePreview={imagePreview}
            categories={categories}
            specifications={specifications}
            newSpec={newSpec}
            setNewSpec={setNewSpec}
            commonSpecTypes={commonSpecTypes}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            handleAddSpecification={handleAddSpecification}
            handleRemoveSpecification={handleRemoveSpecification}
            handleQuickAddSpec={handleQuickAddSpec}
            onSubmit={handleEditProduct}
            onCancel={() => {
              setIsEditModalOpen(false);
              resetForm();
            }}
            isEdit
            formErrors={formErrors}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Product Form Component
const ProductForm = ({
  formData,
  imagePreview,
  categories,
  specifications,
  newSpec,
  setNewSpec,
  commonSpecTypes,
  handleInputChange,
  handleImageUpload,
  handleAddSpecification,
  handleRemoveSpecification,
  handleQuickAddSpec,
  onSubmit,
  onCancel,
  isEdit = false,
  formErrors = {},
  isSubmitting = false
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name (max 150 characters)"
            required
            className={formErrors.name ? 'border-red-500' : ''}
          />
          {formErrors.name && (
            <p className="text-sm text-red-500">{formErrors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category_id">Category *</Label>
          <Select 
            value={formData.category_id.toString()} 
            onValueChange={(value) => handleInputChange({ target: { name: 'category_id', value } })}
          >
            <SelectTrigger className={formErrors.category_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id || cat} value={(cat.id || cat).toString()}>
                  {cat.name || cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.category_id && (
            <p className="text-sm text-red-500">{formErrors.category_id}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          className="dark:bg-gray-900"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter product description (optional)"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            required
            className={formErrors.price ? 'border-red-500' : ''}
          />
          {formErrors.price && (
            <p className="text-sm text-red-500">{formErrors.price}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sale_price">Sale Price (Optional)</Label>
          <Input
            id="sale_price"
            name="sale_price"
            type="number"
            step="0.01"
            value={formData.sale_price}
            onChange={handleInputChange}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="0 (optional)"
            className={formErrors.stock ? 'border-red-500' : ''}
          />
          {formErrors.stock && (
            <p className="text-sm text-red-500">{formErrors.stock}</p>
          )}
        </div>
      </div>

      {/* Product Specifications Section */}
      <div className="space-y-4 border-t pt-4">
        <Label className="text-lg font-semibold">Product Specifications</Label>
        
        {/* Add New Specification */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="spec-name">Specification Name</Label>
            <Input
              id="spec-name"
              value={newSpec.name}
              onChange={(e) => setNewSpec(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Size, Color, Material"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spec-value">Value</Label>
            <Input
              id="spec-value"
              value={newSpec.value}
              onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
              placeholder="e.g., Large, Red, Cotton"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spec-price">Additional Price</Label>
            <Input
              id="spec-price"
              type="number"
              step="0.01"
              min="0"
              value={newSpec.price}
              onChange={(e) => setNewSpec(prev => ({ ...prev, price: e.target.value }))}
              placeholder="0.00"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={handleAddSpecification}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Spec
            </Button>
          </div>
        </div>

        {/* Quick Add Common Specifications */}
        <div className="space-y-3">
          {Object.entries(commonSpecTypes).map(([type, values]) => (
            <div key={type} className="space-y-2">
              <Label className="text-sm font-medium">{type}</Label>
              <div className="flex flex-wrap gap-2">
                {values.map(value => (
                  <button
                    key={`${type}-${value}`}
                    type="button"
                    onClick={() => handleQuickAddSpec(type, value)}
                    className="px-3 py-1 text-sm rounded-md border bg-background hover:bg-accent transition-colors"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Current Specifications List */}
        {specifications.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Specifications</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {specifications.map((spec, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border">
                  <div className="flex-1">
                    <span className="font-medium">{spec.name}:</span>
                    <span className="ml-2">{spec.value}</span>
                    {spec.price > 0 && (
                      <span className="ml-2 text-green-600 font-medium">+${spec.price}</span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveSpecification(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Product Image</Label>
        <div className="flex items-center gap-4">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="flex-1"
          />
          {imagePreview && (
            <div className="w-20 h-20 rounded-lg overflow-hidden border">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleInputChange}
          className="rounded"
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Mark as Featured Product
        </Label>
      </div>

      <div className="flex gap-3 justify-end">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="border-orange-200 dark:border-gray-700 hover:bg-orange-100/50 dark:hover:bg-gray-800/50"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSubmit} 
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {isEdit ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            isEdit ? 'Update Product' : 'Add Product'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductManagement;
