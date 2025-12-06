import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';

// Define the structure for a menu item
interface MenuItem {
  label: string;
  onClick?: () => void;
  path?: string;
  icon?: React.ReactNode;
}

import { useNavigate } from 'react-router-dom';

interface AdminNavButtonProps {
  menuItems: MenuItem[];
}

/**
 * A modern, highly attractive Admin Navigation Button with a dropdown menu.
 * Implements sophisticated micro-interactions and improved closing mechanisms (click-away, ESC key).
 */
const AdminNavButton: React.FC<AdminNavButtonProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // 1. Click-away mechanism
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 2. ESC key mechanism
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={buttonRef} className="relative inline-block text-left z-50">
      {/* Button */}
      <button
        type="button"
        className={`
          admin-nav-button
          flex items-center justify-center
          px-4 py-2 rounded-xl
          text-sm font-medium
          transition-all duration-300 ease-in-out
          shadow-lg
          ${isOpen
            ? 'bg-indigo-700 text-white ring-2 ring-indigo-500 ring-offset-2 ring-offset-white'
            : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
          }
        `}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Settings className="w-5 h-5 mr-2" />
        Admin Tools
        {isOpen ? (
          <ChevronUp className="w-4 h-4 ml-2 transition-transform duration-300" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-2 transition-transform duration-300" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            origin-top-right absolute right-0 mt-2 w-56
            rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5
            transform transition-all duration-300 ease-out
            admin-dropdown-menu
            ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="admin-menu-button"
        >
          <div className="py-1" role="none">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  item.onClick ? item.onClick() : navigate(item.path || '/');
                  setIsOpen(false); // Close menu after selection
                }}
                className="
                  flex items-center px-4 py-2 text-sm text-gray-700
                  hover:bg-indigo-50 hover:text-indigo-700
                  transition-colors duration-150 ease-in-out
                "
                role="menuitem"
              >
                {item.icon && <span className="mr-3 w-5 h-5">{item.icon}</span>}
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNavButton;