import React from 'react';
import Icon from '../../../components/AppIcon';

const LoyaltyCard = ({ loyaltyData }) => {
  const { tier, points, nextTierPoints, totalSpent, benefits } = loyaltyData;
  
  const progressPercentage = (points / nextTierPoints) * 100;
  
  const getTierColor = (tier) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return 'text-amber-600';
      case 'silver':
        return 'text-gray-400';
      case 'gold':
        return 'text-yellow-400';
      case 'platinum':
        return 'text-purple-300';
      default:
        return 'text-white';
    }
  };

  const getTierGradient = (tier) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return 'from-amber-600 to-orange-700';
      case 'silver':
        return 'from-gray-400 to-gray-600';
      case 'gold':
        return 'from-yellow-400 to-amber-500';
      case 'platinum':
        return 'from-purple-500 to-indigo-600';
      default:
        return 'from-orange-500 to-amber-500';
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getTierGradient(tier)} text-white rounded-lg p-6 mb-6 animate-fade-in animation-delay-300`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Loyalty Status</h3>
          <div className="flex items-center space-x-2 mt-1">
            <Icon name="Crown" size={20} className={getTierColor(tier)} />
            <span className="font-bold text-xl">{tier} Member</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{points.toLocaleString()}</div>
          <div className="text-sm opacity-90">Points</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress to {tier === 'Platinum' ? 'maintain' : 'next tier'}</span>
          <span>{points.toLocaleString()} / {nextTierPoints.toLocaleString()}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold">${totalSpent.toLocaleString()}</div>
          <div className="text-sm opacity-90">Total Spent</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{benefits.length}</div>
          <div className="text-sm opacity-90">Active Benefits</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Your Benefits:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <Icon name="Check" size={14} />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyCard;