import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import Logo from '@/components/Logo';

const Footer = () => {
  const footerSections = [

  
    {
      title: "Account",
      links: [
        { name: "My Account", href: "/user-account-dashboard" },
        { name: "Order History", href: "/order-confirmation" },
        { name: "Wishlist", href: "/wishlist" },
        { name: "Track Order", href: "#" },
        { name: "Sign In", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
        { name: "Features", href: "/features" },
        { name: "Support", href: "#" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Use", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", href: "#", color: "hover:bg-blue-600" },
    { name: "Instagram", icon: "Instagram", href: "#", color: "hover:bg-pink-500" },
    { name: "Twitter", icon: "Twitter", href: "#", color: "hover:bg-blue-400" },
    { name: "Youtube", icon: "Youtube", href: "#", color: "hover:bg-red-600" }
  ];

  return (
    <footer className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 text-gray-900 dark:text-gray-200 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Enhanced Newsletter Section */}
      {/* <div className="relative border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-3xl mb-6 shadow-xl">
                <Icon name="Mail" size={28} className="text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                Stay in the loop
              </h3>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
                Subscribe to our newsletter for the latest updates, exclusive offers, and style inspiration delivered straight to your inbox.
              </p>
            </div>
            
            <div className="max-w-lg mx-auto">
              <div className="flex gap-4 p-2 bg-white/50 backdrop-blur-md rounded-2xl border border-orange-200">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-transparent text-gray-900 placeholder-gray-600 border-0 focus:outline-none text-lg"
                />
                <button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Enhanced Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 justify-between lg:grid-cols-4 gap-8">
          {/* Enhanced Brand Section */}
          <div className="space-y-8">
            <Logo size="lg" />
            
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              Your one-stop destination for the latest fashion trends and timeless classics. Experience premium quality and unmatched style.
            </p>
            
            {/* Enhanced Social Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Follow Us</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center ${social.color} border border-white/20 transition-all duration-300 hover:scale-110 hover:border-white/40`}
                    aria-label={social.name}
                  >
                    <Icon name={social.icon} size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Footer Links */}
          {footerSections.map((section, index) => (
            <div key={section.title} className="space-y-6" style={{ animationDelay: `${index * 100}ms` }}>
              <h4 className="text-xl font-bold  dark:text-white text-gray-900 relative">
                {section.title}
                <div className="absolute bottom-0 left-0 w-5 h-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full mt-2"></div>
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 text-base group flex items-center"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                      <Icon 
                        name="ArrowRight" 
                        size={14} 
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300" 
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Bottom Footer */}
      <div className="relative border-t border-orange-200 dark:border-gray-700 bg-orange-100/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-gray-700 dark:text-gray-400 text-base flex items-center">
              <Icon name="Copyright" size={16} className="mr-2" />
               { new Date().getFullYear()} StyleHub Store. All rights reserved.
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;