import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import  Button  from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
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
  Tag,
  Calendar,
  Percent,
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { couponAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const CouponManagement = () => {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteCouponId, setDeleteCouponId] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_purchase: '',
    max_uses: '',
    used_count: 0,
    valid_from: '',
    expires_at: '',
    is_active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    filterCoupons();
  }, [searchTerm, statusFilter, coupons]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponAPI.getAll();
      setCoupons(response.data || []);
      setFilteredCoupons(response.data || []);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch coupons';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCoupons = () => {
    let filtered = [...coupons];
    
    if (searchTerm) {
      filtered = filtered.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(coupon => {
        if (statusFilter === 'active') return coupon.is_active && !isExpired(coupon);
        if (statusFilter === 'expired') return isExpired(coupon);
        if (statusFilter === 'inactive') return !coupon.is_active;
        return true;
      });
    }
    
    setFilteredCoupons(filtered);
  };

  const isExpired = (coupon) => {
    if (!coupon.expires_at) return false;
    return new Date(coupon.expires_at) < new Date();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateCouponCode = () => {
    const code = 'FASHION' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData(prev => ({ ...prev, code }));
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: `Coupon code ${code} copied to clipboard`,
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.code || formData.code.length < 3) {
      errors.code = 'Coupon code is required and must be at least 3 characters';
    }
    
    if (!formData.discount_value || isNaN(formData.discount_value) || parseFloat(formData.discount_value) <= 0) {
      errors.discount_value = 'Discount value is required and must be greater than 0';
    }
    
    if (formData.discount_type === 'percentage' && parseFloat(formData.discount_value) > 100) {
      errors.discount_value = 'Percentage discount cannot exceed 100%';
    }
    
    if (!formData.min_purchase || isNaN(formData.min_purchase) || parseFloat(formData.min_purchase) < 0) {
      errors.min_purchase = 'Minimum purchase is required and must be a positive number';
    }
    
    if (!formData.expires_at) {
      errors.expires_at = 'Expiration date is required';
    }
    
    if (formData.max_uses && (isNaN(formData.max_uses) || parseInt(formData.max_uses) <= 0)) {
      errors.max_uses = 'Max uses must be a positive integer';
    }
    
    if (formData.expires_at && new Date(formData.expires_at) <= new Date()) {
      errors.expires_at = 'Expiration date must be in the future';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCoupon = async () => {
    if (!validateForm()) {
      const errorMessages = Object.values(formErrors).join('. ');
      toast({
        title: "Validation Error",
        description: errorMessages || "Please fix the form errors before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_purchase: parseFloat(formData.min_purchase),
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        valid_from: formData.valid_from || null,
        expires_at: formData.expires_at,
        is_active: formData.is_active
      };

      await couponAPI.create(couponData);
      toast({
        title: "Success",
        description: "Coupon created successfully",
      });
      setIsAddModalOpen(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error('Failed to create coupon:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create coupon';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEditCoupon = async () => {
    if (!validateForm()) {
      const errorMessages = Object.values(formErrors).join('. ');
      toast({
        title: "Validation Error",
        description: errorMessages || "Please fix the form errors before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_purchase: parseFloat(formData.min_purchase),
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        valid_from: formData.valid_from || null,
        expires_at: formData.expires_at,
        is_active: formData.is_active
      };

      await couponAPI.update(selectedCoupon.id, couponData);
      toast({
        title: "Success",
        description: "Coupon updated successfully",
      });
      setIsEditModalOpen(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error('Failed to update coupon:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update coupon';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCoupon = async () => {
    try {
      await couponAPI.delete(deleteCouponId);
      toast({
        title: "Success",
        description: "Coupon deleted successfully",
      });
      setDeleteCouponId(null);
      fetchCoupons();
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete coupon';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const toggleCouponStatus = async (coupon) => {
    try {
      await couponAPI.update(coupon.id, { ...coupon, is_active: !coupon.is_active });
      toast({
        title: "Success",
        description: `Coupon ${coupon.is_active ? 'deactivated' : 'activated'} successfully`,
      });
      fetchCoupons();
    } catch (error) {
      console.error('Failed to update coupon status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update coupon status';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_purchase: coupon.min_purchase || '',
      max_uses: coupon.max_uses || '',
      used_count: coupon.used_count || 0,
      valid_from: coupon.valid_from || '',
      expires_at: coupon.expires_at || '',
      is_active: coupon.is_active
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      min_purchase: '',
      max_uses: '',
      used_count: 0,
      valid_from: '',
      expires_at: '',
      is_active: true
    });
    setSelectedCoupon(null);
    setFormErrors({});
  };

  const getStatusBadge = (coupon) => {
    if (isExpired(coupon)) return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    if (!coupon.is_active) return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  };

  const getStatusText = (coupon) => {
    if (isExpired(coupon)) return 'Expired';
    if (!coupon.is_active) return 'Inactive';
    return 'Active';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="md" />
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
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>
                Set up a new discount coupon for your customers
              </DialogDescription>
            </DialogHeader>
            <CouponForm
              formData={formData}
              handleInputChange={handleInputChange}
              generateCouponCode={generateCouponCode}
              onSubmit={handleAddCoupon}
              onCancel={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              formErrors={formErrors}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Coupons Grid */}
      {filteredCoupons.length === 0 ? (
        <div className="py-12 text-center animate-fade-in animation-delay-150">
          <Tag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No coupons found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? "Try adjusting your filters" 
              : "Start by creating your first coupon"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon, index) => (
            <Card 
              key={coupon.id} 
              className="p-6 hover:shadow-lg dark:bg-gray-800 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${150 + index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold font-mono">{coupon.code}</h3>
                    <button
                      onClick={() => copyToClipboard(coupon.code)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <span className={getStatusBadge(coupon)}>
                    {getStatusText(coupon)}
                  </span>
                </div>
                <button
                  onClick={() => toggleCouponStatus(coupon)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {coupon.is_active ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {coupon.description || 'No description'}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="font-semibold">
                    {coupon.discount_type === 'percentage' 
                      ? `${coupon.discount_value}%` 
                      : `$${coupon.discount_value}`}
                  </span>
                </div>
                {coupon.min_purchase > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Min. Purchase:</span>
                    <span className="font-semibold">${coupon.min_purchase}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Usage:</span>
                  <span className="font-semibold">
                    {coupon.used_count} / {coupon.max_uses || '∞'}
                  </span>
                </div>
                {coupon.expires_at && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="font-semibold">
                      {new Date(coupon.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-orange-200 dark:border-gray-700 dark:bg-gray-500 hover:bg-orange-100/50 dark:hover:bg-gray-600"
                  onClick={() => openEditModal(coupon)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => setDeleteCouponId(coupon.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Coupon Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>
              Update the coupon details below
            </DialogDescription>
          </DialogHeader>
          <CouponForm
            formData={formData}
            handleInputChange={handleInputChange}
            generateCouponCode={generateCouponCode}
            onSubmit={handleEditCoupon}
            onCancel={() => {
              setIsEditModalOpen(false);
              resetForm();
            }}
            isEdit
            formErrors={formErrors}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCouponId} onOpenChange={() => setDeleteCouponId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the coupon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCoupon}>
              Delete Coupon
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Coupon Form Component
const CouponForm = ({
  formData,
  handleInputChange,
  generateCouponCode,
  onSubmit,
  onCancel,
  isEdit = false,
  formErrors = {}
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Coupon Code *</Label>
          <div className="flex gap-2">
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="SUMMER2024"
              className={`uppercase ${formErrors.code ? 'border-red-500' : ''}`}
              required
            />
            {!isEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={generateCouponCode}
              >
                Generate
              </Button>
            )}
          </div>
          {formErrors.code && (
            <p className="text-sm text-red-500">{formErrors.code}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount_type">Discount Type</Label>
          <Select 
            value={formData.discount_type} 
            onValueChange={(value) => handleInputChange({ target: { name: 'discount_type', value } })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
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
          placeholder="Summer sale discount - 20% off on all items"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discount_value">
            Discount Value * {formData.discount_type === 'percentage' ? '(%)' : '($)'}
          </Label>
          <Input
            id="discount_value"
            name="discount_value"
            type="number"
            step={formData.discount_type === 'percentage' ? '1' : '0.01'}
            min="0"
            max={formData.discount_type === 'percentage' ? '100' : undefined}
            value={formData.discount_value}
            onChange={handleInputChange}
            placeholder={formData.discount_type === 'percentage' ? '20' : '10.00'}
            className={formErrors.discount_value ? 'border-red-500' : ''}
            required
          />
          {formErrors.discount_value && (
            <p className="text-sm text-red-500">{formErrors.discount_value}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="min_purchase">Min. Purchase ($) *</Label>
          <Input
            id="min_purchase"
            name="min_purchase"
            type="number"
            step="0.01"
            min="0"
            value={formData.min_purchase}
            onChange={handleInputChange}
            placeholder="50.00"
            className={formErrors.min_purchase ? 'border-red-500' : ''}
            required
          />
          {formErrors.min_purchase && (
            <p className="text-sm text-red-500">{formErrors.min_purchase}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_uses">Max Uses</Label>
          <Input
            id="max_uses"
            name="max_uses"
            type="number"
            min="1"
            value={formData.max_uses}
            onChange={handleInputChange}
            placeholder="100"
            className={formErrors.max_uses ? 'border-red-500' : ''}
          />
          {formErrors.max_uses && (
            <p className="text-sm text-red-500">{formErrors.max_uses}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valid_from">Valid From</Label>
          <Input
            id="valid_from"
            name="valid_from"
            type="datetime-local"
            value={formData.valid_from}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expires_at">Expires At *</Label>
          <Input
            id="expires_at"
            name="expires_at"
            type="datetime-local"
            value={formData.expires_at}
            onChange={handleInputChange}
            className={formErrors.expires_at ? 'border-red-500' : ''}
            required
          />
          {formErrors.expires_at && (
            <p className="text-sm text-red-500">{formErrors.expires_at}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleInputChange}
          className="rounded"
        />
        <Label htmlFor="is_active" className="cursor-pointer">
          Activate coupon immediately
        </Label>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel} className="border-orange-200 dark:border-gray-700 hover:bg-orange-100/50 dark:hover:bg-gray-800/50">
          Cancel
        </Button>
        <Button onClick={onSubmit} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg">
          {isEdit ? 'Update Coupon' : 'Create Coupon'}
        </Button>
      </div>
    </div>
  );
};

export default CouponManagement;
