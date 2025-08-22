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
  Tag,
  Calendar,
  Percent,
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { couponAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteCouponId, setDeleteCouponId] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    minimum_purchase: '',
    max_uses: '',
    used_count: 0,
    valid_from: '',
    valid_until: '',
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
      setCoupons(response.data);
      setFilteredCoupons(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch coupons",
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
    if (!coupon.valid_until) return false;
    return new Date(coupon.valid_until) < new Date();
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

  const handleAddCoupon = async () => {
    try {
      await couponAPI.create(formData);
      toast({
        title: "Success",
        description: "Coupon created successfully",
      });
      setIsAddModalOpen(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create coupon",
        variant: "destructive",
      });
    }
  };

  const handleEditCoupon = async () => {
    try {
      await couponAPI.update(selectedCoupon.id, formData);
      toast({
        title: "Success",
        description: "Coupon updated successfully",
      });
      setIsEditModalOpen(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update coupon",
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
      toast({
        title: "Error",
        description: "Failed to delete coupon",
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
      toast({
        title: "Error",
        description: "Failed to update coupon status",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      minimum_purchase: coupon.minimum_purchase,
      max_uses: coupon.max_uses,
      used_count: coupon.used_count,
      valid_from: coupon.valid_from,
      valid_until: coupon.valid_until,
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
      minimum_purchase: '',
      max_uses: '',
      used_count: 0,
      valid_from: '',
      valid_until: '',
      is_active: true
    });
    setSelectedCoupon(null);
  };

  const getStatusBadge = (coupon) => {
    if (isExpired(coupon)) return 'admin-badge error';
    if (!coupon.is_active) return 'admin-badge warning';
    return 'admin-badge success';
  };

  const getStatusText = (coupon) => {
    if (isExpired(coupon)) return 'Expired';
    if (!coupon.is_active) return 'Inactive';
    return 'Active';
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  return (
    <div className="coupon-management">
      {/* Search and Filters */}
      <div className="admin-search-bar animate-fade-in">
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
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
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Coupons Grid */}
      {filteredCoupons.length === 0 ? (
        <div className="admin-empty-state animate-fade-in animation-delay-150">
          <Tag className="admin-empty-icon" />
          <h3 className="admin-empty-title">No coupons found</h3>
          <p className="admin-empty-description">
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
              className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
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
                {coupon.minimum_purchase > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Min. Purchase:</span>
                    <span className="font-semibold">${coupon.minimum_purchase}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Usage:</span>
                  <span className="font-semibold">
                    {coupon.used_count} / {coupon.max_uses || '∞'}
                  </span>
                </div>
                {coupon.valid_until && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="font-semibold">
                      {new Date(coupon.valid_until).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
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
  isEdit = false
}) => {
  return (
    <div className="admin-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="admin-form-group">
          <Label htmlFor="code">Coupon Code</Label>
          <div className="flex gap-2">
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="SUMMER2024"
              className="uppercase"
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
        </div>
        <div className="admin-form-group">
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

      <div className="admin-form-group">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Summer sale discount - 20% off on all items"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-form-group">
          <Label htmlFor="discount_value">
            Discount Value {formData.discount_type === 'percentage' ? '(%)' : '($)'}
          </Label>
          <Input
            id="discount_value"
            name="discount_value"
            type="number"
            step={formData.discount_type === 'percentage' ? '1' : '0.01'}
            value={formData.discount_value}
            onChange={handleInputChange}
            placeholder={formData.discount_type === 'percentage' ? '20' : '10.00'}
            required
          />
        </div>
        <div className="admin-form-group">
          <Label htmlFor="minimum_purchase">Min. Purchase ($)</Label>
          <Input
            id="minimum_purchase"
            name="minimum_purchase"
            type="number"
            step="0.01"
            value={formData.minimum_purchase}
            onChange={handleInputChange}
            placeholder="50.00"
          />
        </div>
        <div className="admin-form-group">
          <Label htmlFor="max_uses">Max Uses</Label>
          <Input
            id="max_uses"
            name="max_uses"
            type="number"
            value={formData.max_uses}
            onChange={handleInputChange}
            placeholder="100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="admin-form-group">
          <Label htmlFor="valid_from">Valid From</Label>
          <Input
            id="valid_from"
            name="valid_from"
            type="datetime-local"
            value={formData.valid_from}
            onChange={handleInputChange}
          />
        </div>
        <div className="admin-form-group">
          <Label htmlFor="valid_until">Valid Until</Label>
          <Input
            id="valid_until"
            name="valid_until"
            type="datetime-local"
            value={formData.valid_until}
            onChange={handleInputChange}
          />
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
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {isEdit ? 'Update Coupon' : 'Create Coupon'}
        </Button>
      </div>
    </div>
  );
};

export default CouponManagement;
