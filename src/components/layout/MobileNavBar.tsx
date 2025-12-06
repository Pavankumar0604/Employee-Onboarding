import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, User, Clock } from 'lucide-react';

// Define mobile navigation links for the Field Officer flow
const mobileNavLinks = [
  { to: '/site/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/onboarding', label: 'Enrollment', icon: FileText },
  { to: '/leaves/dashboard', label: 'Tracker', icon: Clock },
  { to: '/profile', label: 'Profile', icon: User },
];

const MobileNavBar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 shadow-2xl md:hidden">
      <div className="flex justify-around h-16">
        {mobileNavLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full text-xs font-medium transition-colors duration-200 ${
                isActive 
                ? 'text-accent' 
                : 'text-muted hover:text-accent'
              }`
            }
          >
            <link.icon className="h-6 w-6 mb-1" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavBar;