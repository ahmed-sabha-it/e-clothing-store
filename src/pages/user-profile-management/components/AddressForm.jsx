import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Input } from '../../../components/ui/input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const AddressForm = ({ address = null, onSave, onCancel, title }) => {
  const [formData, setFormData] = useState({
    label: address?.label || '',
    fullName: address?.fullName || '',
    street: address?.street || '',
    apartment: address?.apartment || '',
    city: address?.city || '',
    state: address?.state || '',
    zipCode: address?.zipCode || '',
    country: address?.country || 'United States',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Address label is required';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(formData);
    } catch (error) {
      setErrors({ submit: 'Failed to save address. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <button
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-smooth"
        >
          <Icon name="X" size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Address Label"
          name="label"
          value={formData.label}
          onChange={handleInputChange}
          error={errors.label}
          placeholder="e.g., Home, Work, Mom's House"
          required
        />

        <Input
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          error={errors.fullName}
          required
        />

        <Input
          label="Street Address"
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          error={errors.street}
          required
        />

        <Input
          label="Apartment, Suite, etc. (Optional)"
          name="apartment"
          value={formData.apartment}
          onChange={handleInputChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            error={errors.city}
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              State <span className="text-error">*</span>
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && (
              <p className="mt-1 text-sm text-error">{errors.state}</p>
            )}
          </div>

          <Input
            label="ZIP Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            error={errors.zipCode}
            placeholder="12345"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Country
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
          </select>
        </div>

        <Input
          label="Phone Number (Optional)"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          error={errors.phone}
          description="For delivery updates"
        />

        <Checkbox
          label="Set as default address"
          checked={formData.isDefault}
          onChange={handleInputChange}
          name="isDefault"
        />

        {errors.submit && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-md">
            <p className="text-error text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            className="flex-1 sm:flex-none"
          >
            Save Address
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;