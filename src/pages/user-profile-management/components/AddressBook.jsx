import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AddressForm from './AddressForm';

const AddressBook = ({ addresses, onAddAddress, onEditAddress, onDeleteAddress, onSetDefault }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleAddAddress = (addressData) => {
    onAddAddress(addressData);
    setShowAddForm(false);
  };

  const handleEditAddress = (addressData) => {
    onEditAddress(editingAddress.id, addressData);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      onDeleteAddress(addressId);
    }
  };

  if (showAddForm) {
    return (
      <AddressForm
        onSave={handleAddAddress}
        onCancel={() => setShowAddForm(false)}
        title="Add New Address"
      />
    );
  }

  if (editingAddress) {
    return (
      <AddressForm
        address={editingAddress}
        onSave={handleEditAddress}
        onCancel={() => setEditingAddress(null)}
        title="Edit Address"
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Address Book</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          iconName="Plus"
          iconPosition="left"
          size="sm"
        >
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="MapPin" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No addresses saved</h3>
          <p className="text-muted-foreground mb-4">Add your first address to make checkout faster</p>
          <Button
            onClick={() => setShowAddForm(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 transition-smooth ${
                address.isDefault
                  ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-foreground">{address.label}</h3>
                  {address.isDefault && (
                    <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditingAddress(address)}
                    className="p-1 text-muted-foreground hover:text-accent transition-smooth"
                  >
                    <Icon name="Edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-1 text-muted-foreground hover:text-error transition-smooth"
                    disabled={address.isDefault}
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground mb-4">
                <p className="text-foreground font-medium">{address.fullName}</p>
                <p>{address.street}</p>
                {address.apartment && <p>{address.apartment}</p>}
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                {address.phone && (
                  <p className="flex items-center space-x-1 mt-2">
                    <Icon name="Phone" size={14} />
                    <span>{address.phone}</span>
                  </p>
                )}
              </div>

              {!address.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSetDefault(address.id)}
                  className="w-full"
                >
                  Set as Default
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressBook;