import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Icon from '@/components/AppIcon';

/**
 * Unified Store Logo used in both Header and Footer to keep styles consistent.
 * It renders the gradient icon box followed by the brand name.
 * 
 * @param {Object} props - Component props
 * @param {'sm' | 'lg'} [props.size='sm'] - Controls the text size. `sm` is used in the header, `lg` in the footer.
 * @param {string} [props.className=''] - Extra classes forwarded to the root element.
 */
const Logo = ({ size = 'sm', className = '' }) => {
  const textSize = size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <Link to="/" className={cn('flex items-center space-x-3 group', className)}>
      <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
        <Icon name="Shirt" size={24} color="white" />
      </div>
      <span className={cn(textSize, 'font-bold gradient-text hidden sm:block')}>Chicora</span>
    </Link>
  );
};

export default Logo;
