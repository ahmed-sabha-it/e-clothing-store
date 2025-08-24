import React from 'react';
import Icon from '../../../components/AppIcon';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger", // danger, primary
  isLoading = false
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const confirmButtonClasses = confirmVariant === 'danger' 
    ? "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400"
    : "bg-accent hover:bg-accent/90 text-white disabled:bg-accent/50";

  return (
    <div 
      className="fixed inset-0 bg-orange-500/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-border rounded-lg shadow-xl max-w-md w-full animate-fade-in animation-delay-150">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-orange-100/30 dark:bg-gray-800/30 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-orange-100/50 dark:hover:bg-gray-700/50 rounded-md transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-smooth disabled:cursor-not-allowed ${confirmButtonClasses}`}
          >
            {isLoading && <Icon name="Loader2" size={16} className="animate-spin" />}
            <span>{isLoading ? 'Processing...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
