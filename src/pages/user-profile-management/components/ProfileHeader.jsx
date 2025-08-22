import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProfileHeader = ({ user, onEditProfile }) => {
  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-border rounded-lg p-6 mb-6 animate-fade-in animation-delay-150">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-orange-100/50 dark:bg-gray-700/50">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon name="User" size={32} className="text-muted-foreground" />
              </div>
            )}
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center hover:bg-accent/90 transition-smooth">
            <Icon name="Camera" size={16} />
          </button>
        </div>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground mb-1">{user.name}</h1>
          <p className="text-muted-foreground mb-2">{user.email}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={16} />
              <span>Member since {user.memberSince}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={16} />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Phone" size={16} />
              <span>{user.phone}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onEditProfile}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
        >
          <Icon name="Edit" size={16} />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;