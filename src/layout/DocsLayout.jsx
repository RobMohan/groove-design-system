import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';

export default function DocsLayout({ children }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [theme, setTheme] = useState(
    () => (typeof localStorage !== 'undefined' && localStorage.getItem('groove-theme')) || 'light'
  );

  // Reflect the chosen theme on <html> and persist it.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('groove-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

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
    <div className="min-h-screen bg-surface">
      {/* Hamburger Button - Shows when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-surface-raised text-ink rounded-lg shadow-elevation-2 hover:bg-surface-muted transition-colors"
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
        className={`fixed left-0 top-0 h-full w-64 bg-surface-raised border-r border-line overflow-y-auto z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header with theme toggle + Close Button */}
          <div className="flex items-start justify-between gap-2 mb-8">
            <Link to="/" className="flex-1" onClick={() => window.innerWidth < 1024 && setIsOpen(false)}>
              <h1 className="text-2xl font-bold mb-1 text-ink">Groove Design System</h1>
              <p className="text-sm text-ink-muted">Component Documentation</p>
            </Link>

            <div className="flex items-center gap-1 shrink-0">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 text-ink-muted hover:text-ink hover:bg-surface-muted rounded-lg transition-colors"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Close Button - Top right of panel */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-ink-muted hover:bg-surface-muted rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <nav className="space-y-6">
            <div>
              <div className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-2 px-4">
                Getting Started
              </div>
              <Link
                to="/"
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                className={`flex items-center justify-start w-full px-4 py-2.5 rounded-lg transition-colors ${
                  isActive('/')
                    ? 'bg-primary text-white'
                    : 'text-ink-muted hover:bg-surface-muted'
                }`}
              >
                <span className="font-medium">Home</span>
              </Link>
            </div>

            <div>
              <div className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-2 px-4">
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
                      : 'text-ink-muted hover:bg-surface-muted'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            <div>
              <div className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-2 px-4">
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
                      : 'text-ink-muted hover:bg-surface-muted'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="mt-8 pt-8 border-t border-line space-y-3">
            <a
              href="https://github.com/RobMohan/groove-design-system"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink px-4 transition-colors"
            >
              <span>GitHub</span>
              <span>→</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/robertmohan" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink px-4 transition-colors"
            >
              <span>LinkedIn</span>
              <span>→</span>
            </a>
            <a 
              href="mailto:rob@robertmohandesign.com"
              className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink px-4 transition-colors"
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