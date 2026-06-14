import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function DocsLayout({ children }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  
  const foundationItems = [
    { path: '/color-tokens', label: 'Color Tokens' },
    { path: '/typography', label: 'Typography' },
    { path: '/spacing', label: 'Spacing' },
    { path: '/elevation', label: 'Elevation' },
    { path: '/radius', label: 'Radius' },
  ];

  const componentItems = [
    { path: '/accordion', label: 'Accordion' },
    { path: '/alert', label: 'Alert' },
    { path: '/avatar', label: 'Avatar' },
    { path: '/badge', label: 'Badge' },
    { path: '/breadcrumbs', label: 'Breadcrumbs' },
    { path: '/button', label: 'Button' },
    { path: '/card', label: 'Card' },
    { path: '/checkbox', label: 'Checkbox' },
    { path: '/data-table', label: 'Data Table' },
    { path: '/menu', label: 'Menu' },
    { path: '/modal', label: 'Modal' },
    { path: '/progress', label: 'Progress' },
    { path: '/radio', label: 'Radio' },
    { path: '/select', label: 'Select' },
    { path: '/skeleton', label: 'Skeleton' },
    { path: '/spinner', label: 'Spinner' },
    { path: '/stat-card', label: 'Stat Card' },
    { path: '/tabs', label: 'Tabs' },
    { path: '/toast', label: 'Toast' },
    { path: '/toggle', label: 'Toggle' },
    { path: '/text-input', label: 'Text Input' },
    { path: '/textarea', label: 'Textarea' },
    { path: '/tooltip', label: 'Tooltip' },
  ];
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hamburger Button - Shows when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Left Sidebar Navigation */}
      <div 
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header with Close Button */}
          <div className="flex items-start justify-between mb-8">
            <Link to="/" className="flex-1" onClick={() => window.innerWidth < 1024 && setIsOpen(false)}>
              <h1 className="text-2xl font-bold mb-1">Groove Design System</h1>
              <p className="text-sm text-gray-600">Component Documentation</p>
            </Link>
            
            {/* Close Button - Top right of panel */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="space-y-6">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
                Getting Started
              </div>
              <Link
                to="/"
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                className={`flex items-center justify-start w-full px-4 py-2.5 rounded-lg transition-colors ${
                  isActive('/')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="font-medium">Home</span>
              </Link>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
                Design Foundations
              </div>
              {foundationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                  className={`flex items-center justify-start w-full px-4 py-2.5 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
                Components
              </div>
              {componentItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                  className={`flex items-center justify-start w-full px-4 py-2.5 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-200 space-y-3">
            <a 
              href="https://github.com/RobMohan/component-test" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-4 transition-colors"
            >
              <span>GitHub</span>
              <span>→</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/robertmohan" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-4 transition-colors"
            >
              <span>LinkedIn</span>
              <span>→</span>
            </a>
            <a 
              href="mailto:rob@robertmohandesign.com"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-4 transition-colors"
            >
              <span>Email</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'}`}>
        {children}
      </div>
    </div>
  );
}