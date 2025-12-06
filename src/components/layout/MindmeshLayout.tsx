// Employee-Onboarding/src/components/layout/MindmeshLayout.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Outlet, NavLink, useNavigate, type NavigateFunction } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Settings, ChevronDown, ClipboardList, Menu, X, ChevronsLeft, ChevronsRight, Clock, ShieldHalf, ClipboardEdit, Receipt, ChevronUp, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import logo from '../../assests/logo.png'; // Import logo asset
import type { Permission } from '../../types/mindmesh';
import NotificationBell from '../notifications/NotificationBell';
import Button from '../ui/Button';
import { useUiSettingsStore } from '../../store/uiSettingsStore';
import Modal from '../ui/Modal';
import { useNotificationStore } from '../../store/notificationStore';
import { useMediaQuery } from '../../hooks/useMediaQuery';

// --- Interfaces and Constants ---

interface NavLinkConfig {
    to: string;
    label: string;
    icon: React.ElementType;
    permission: Permission;
}

const allNavLinks: NavLinkConfig[] = [
    { to: '/submissions', label: 'All Submissions', icon: LayoutDashboard, permission: 'view_all_submissions' },
    { to: '/attendance', label: 'Attendance', icon: Clock, permission: 'view_own_attendance' },
    { to: '/enrollment/new', label: 'New Enrollment', icon: UserIcon, permission: 'create_enrollment' },
    { to: '/operations/task-management', label: 'Task Management', icon: ClipboardList, permission: 'manage_tasks' },
    { to: '/site-dashboard', label: 'Site Dashboard', icon: LayoutDashboard, permission: 'view_site_dashboard' },
    { to: '/api-settings', label: 'API Settings', icon: Settings, permission: 'view_developer_settings' },
    { to: '/attendance/rules', label: 'Attendance Rules', icon: Settings, permission: 'manage_attendance_rules' },
    { to: '/management/backendsupport', label: 'Backend Support', icon: Settings, permission: 'view_entity_management' },
    { to: '/management/clients', label: 'Client Management', icon: ClipboardList, permission: 'view_entity_management' },
    { to: '/enrollment/rules', label: 'Enrollment Rules', icon: ClipboardEdit, permission: 'manage_enrollment_rules' },
    { to: '/management/insurance', label: 'Insurance Management', icon: ShieldHalf, permission: 'manage_insurance' },
    { to: '/finance/summary', label: 'Invoice Summary', icon: Receipt, permission: 'view_invoice_summary' },
    { to: '/user/roles', label: 'User Roles', icon: ShieldHalf, permission: 'manage_roles' },
    { to: '/management/sites', label: 'Site Management', icon: ClipboardList, permission: 'manage_sites' },
    { to: '/profile', label: 'Profile', icon: UserIcon, permission: 'view_profile' },
    { to: '/dashboard', label: 'Operations Dashboard', icon: LayoutDashboard, permission: 'view_operations_dashboard' },
];

const primaryNavLabels = ['All Submissions', 'Attendance', 'New Enrollment', 'Operations', 'Site Dashboard', 'Task Management'];

// --- Sidebar Component ---

interface SidebarContentProps {
    isCollapsed: boolean;
    onLinkClick?: () => void;
    className?: string;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ isCollapsed, onLinkClick, className }) => {
    const { user } = useAuth();
    // DEBUG: Temporarily bypass permission check to ensure links render
    const availableNavLinks = user ? allNavLinks
        // .filter(link => permissions[user.role]?.includes(link.permission)) // Temporarily disabled for debugging
        .sort((a, b) => a.label.localeCompare(b.label))
        : [];

    const primaryLinks = availableNavLinks.filter(link => primaryNavLabels.includes(link.label));
    const secondaryLinks = availableNavLinks.filter(link => !primaryNavLabels.includes(link.label));

    const renderNavLinks = (links: NavLinkConfig[]) => (
        links.map(link => (
            <NavLink
                key={link.to}
                to={link.to}
                onClick={onLinkClick}
                className={({ isActive }) =>
                    `layout-navLink ${isActive ? 'bg-sky-400 text-white' : ''} ${isCollapsed ? 'layout-navLinkCollapsed' : ''}`
                }
                title={isCollapsed ? link.label : undefined}
            >
                <link.icon className="layout-navIcon" />
                {!isCollapsed && <span>{link.label}</span>}
            </NavLink>
        ))
    );

    return (
        <nav className={`layout-sidebarNav ${className}`}>
            <div className="layout-navSection">
                {renderNavLinks(primaryLinks)}
            </div>

            {secondaryLinks.length > 0 && (
                <div className="layout-navSection">
                    {renderNavLinks(secondaryLinks)}
                </div>
            )}
        </nav>
    );
};

// --- Header Component ---

interface HeaderProps {
    user: { name: string | null; role: string; photo_url?: string | null } | null;
    getRoleName: (role: string) => string;
    isUserMenuOpen: boolean;
    setIsUserMenuOpen: (isOpen: boolean) => void;
    userMenuRef: React.RefObject<HTMLDivElement>;
    handleLogoutClick: () => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    navigate: NavigateFunction;
    permissions: Record<string, Permission[]>;
}

const Header: React.FC<HeaderProps> = ({
    user,
    getRoleName,
    isUserMenuOpen,
    setIsUserMenuOpen,
    userMenuRef,
    handleLogoutClick,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    navigate,
}) => {
    return (
        <header className="layout-header">
            <div className="flex items-center justify-between w-full">
                {/* Left side: Logo/Menu button (only visible on mobile/collapsed) */}
                <div className="flex items-center">
                    <div className="lg:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                    {/* Desktop Logo placeholder (if needed, currently handled by sidebar) */}
                </div>

                {/* Right side: Notifications and User */}
                <div className="flex items-center gap-6">
                    <NotificationBell />
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="layout-userDropdownButton flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200 group"
                        >
                            <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all">
                                {user?.photo_url ? (
                                    <img
                                        src={user.photo_url}
                                        alt={user.name || 'User'}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            // Fallback to icon on error
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-indigo-50');
                                            const icon = document.createElement('div');
                                            icon.innerHTML = '<svg class="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                                            e.currentTarget.parentElement?.appendChild(icon);
                                        }}
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center">
                                        <UserIcon className="h-5 w-5 text-indigo-500" />
                                    </div>
                                )}
                            </div>

                            <div className="text-left hidden sm:flex flex-col">
                                <p className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-indigo-700 transition-colors">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                                    {user ? getRoleName(user.role) : 'Guest'}
                                </p>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {/* User Dropdown Menu (Rendered in MindmeshLayout, but triggered here) */}
                        {isUserMenuOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-300 ease-out z-50">
                                <div className="py-1" role="none">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/profile');
                                            setIsUserMenuOpen(false);
                                        }}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150 ease-in-out"
                                        role="menuitem"
                                    >
                                        Profile
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLogoutClick();
                                            setIsUserMenuOpen(false);
                                        }}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150 ease-in-out"
                                        role="menuitem"
                                    >
                                        Logout
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};


// --- Main Layout Component ---

interface MindmeshLayoutProps { }

const MindmeshLayout: React.FC<MindmeshLayoutProps> = () => {
    const { user, profile, signOutUser: logout } = useAuth()

    const { fetchNotifications } = useNotificationStore();
    const { autoScrollOnHover } = useUiSettingsStore();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    // Automatically collapse sidebar on smaller desktop screens (e.g., below 1280px)
    const isSmallDesktop = useMediaQuery('(max-width: 1279px)');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isSmallDesktop);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const pageScrollIntervalRef = useRef<number | null>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);

    const [scrollPosition, setScrollPosition] = useState(0);
    const [showScrollButtons, setShowScrollButtons] = useState(false);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Use md breakpoint for mobile detection to allow collapse logic to run on small desktops

    // Determine accent color based on user role or a fixed default
    // const accentColor = '#249657'; // Accent Green (Removed as color is now handled by CSS variables)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    // Effect to automatically collapse/expand sidebar based on desktop screen size
    useEffect(() => {
        // Only apply automatic collapse/expand if not in mobile view (lg breakpoint)
        if (!isMobile) {
            setIsSidebarCollapsed(isSmallDesktop);
        }
    }, [isSmallDesktop, isMobile]);


    // const isFieldOfficer = user?.role === 'field_officer';
    // const isMobileOfficerExperience = isFieldOfficer && isMobile;

    // const isMobileOfficerFlowPage = location.pathname.startsWith('/onboarding') || location.pathname.startsWith('/profile') || location.pathname.startsWith('/leaves/dashboard');
    // const isMobileOfficerFlow = isMobileOfficerExperience && isMobileOfficerFlowPage;

    // const showMobileNavBar = isMobileOfficerFlow;

    // useEffect(() => {
    //     if (isMobileOfficerFlow) {
    //         document.body.classList.add('layout-fieldOfficerDarkTheme');
    //     } else {
    //         document.body.classList.remove('layout-fieldOfficerDarkTheme');
    //     }
    //     // Cleanup function
    //     return () => {
    //         document.body.classList.remove('layout-fieldOfficerDarkTheme');
    //     };
    // }, [isMobileOfficerFlow]);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user?.id, fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const stopPageScrolling = useCallback(() => {
        if (pageScrollIntervalRef.current) {
            clearInterval(pageScrollIntervalRef.current);
            pageScrollIntervalRef.current = null;
        }
    }, []);

    const handleScroll = useCallback(() => {
        const mainEl = mainContentRef.current;
        if (mainEl) {
            const isScrollable = mainEl.scrollHeight > mainEl.clientHeight;
            setShowScrollButtons(isScrollable);
            setScrollPosition(mainEl.scrollTop);
        }
    }, []);


    useEffect(() => {
        const mainEl = mainContentRef.current;
        mainEl?.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        handleScroll();

        return () => {
            mainEl?.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            stopPageScrolling();
        };
    }, [handleScroll, stopPageScrolling]);

    const handleScrollUp = useCallback(() => {
        mainContentRef.current?.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
    }, []);

    const handleScrollDown = useCallback(() => {
        mainContentRef.current?.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }, []);

    const startPageScrolling = useCallback((direction: 'up' | 'down') => {
        stopPageScrolling();
        const handler = direction === 'up' ? handleScrollUp : handleScrollDown;
        handler();
        pageScrollIntervalRef.current = window.setInterval(handler, 300);
    }, [handleScrollUp, handleScrollDown, stopPageScrolling]);

    const getRoleName = (role: string) => {
        return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    const handleLogoutClick = () => {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = async () => {
        setIsLogoutModalOpen(false);
        await logout();
        navigate('/auth/login');
    };

    // Framer Motion variants for main layout entrance
    const layoutVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        },
    };

    const sidebarVariants = {
        hidden: { x: -50, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15, delay: 0.1 } },
    };

    const contentVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15, delay: 0.2 } },
    };




    return (
        <motion.div
            className="layout-appLayout"
            variants={layoutVariants as any}
            initial="hidden"
            animate="visible"
        >
            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
                title="Confirm Log Out"
            >
                Are you sure you want to log out?
            </Modal>

            {/* Desktop Sidebar Card */}
            <motion.aside
                className={`layout-sidebarCard layout-desktop-sidebar lg:flex ${isSidebarCollapsed ? 'layout-sidebarCard--collapsed' : ''}`}
                variants={sidebarVariants as any}
                animate={{ width: isSidebarCollapsed ? '72px' : '240px' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {/* Branding Component */}
                <div className="layout-sidebarHeader">
                    <motion.div
                        className="layout-brandingContainer"
                        initial={false}
                        animate={{ width: isSidebarCollapsed ? '40px' : '100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {/* Full Logo (Visible when expanded) */}
                        <motion.img
                            src={logo}
                            alt="Mindmesh Logo"
                            className="layout-fullLogo"
                            initial={false}
                            animate={{ opacity: isSidebarCollapsed ? 0 : 1, scale: isSidebarCollapsed ? 0.8 : 1 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        />

                        {/* Compact Logo (Visible when collapsed) */}
                        <motion.img
                            src={logo}
                            alt="Mindmesh Icon"
                            className="layout-compactLogo"
                            initial={false}
                            animate={{ opacity: isSidebarCollapsed ? 1 : 0, scale: isSidebarCollapsed ? 1 : 0.8 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        />
                    </motion.div>
                </div>

                <SidebarContent isCollapsed={isSidebarCollapsed} />

                {/* Sidebar Footer Utility Buttons */}
                <div className="layout-sidebarFooter">
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isSidebarCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
                    </button>
                </div>
            </motion.aside>

            {/* Mobile Sidebar & Backdrop (using AnimatePresence for smooth exit) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            aria-hidden="true"
                        />
                        <motion.aside
                            className={`layout-sidebarCard fixed inset-y-0 left-0 z-50 lg:hidden layout-sidebarOpen`}
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                        >
                            <SidebarContent isCollapsed={false} onLinkClick={() => setIsMobileMenuOpen(false)} />
                            {/* Mobile Sidebar Footer (Close button) */}
                            <div className="layout-sidebarFooter">
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                    <span className="ml-3 text-sm font-medium">Close Menu</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area (Right Card) */}
            <motion.div
                className="layout-mainContentArea"
                variants={contentVariants as any}
                /* Removed explicit width animation, relying on flex-grow: 1 in CSS */
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {/* Top Header (Minimal, Transparent) */}
                {/* Top Header (Minimal, Transparent) */}
                <Header
                    user={profile ? {
                        name: profile.name || profile.full_name || user?.email || 'User',
                        role: profile.role || 'Guest',
                        photo_url: profile.photo_url
                    } : (user ? {
                        name: user.email || 'User',
                        role: 'Guest',
                        photo_url: null
                    } : null)}
                    getRoleName={getRoleName}
                    isUserMenuOpen={isUserMenuOpen}
                    setIsUserMenuOpen={setIsUserMenuOpen}
                    userMenuRef={userMenuRef}
                    handleLogoutClick={handleLogoutClick}
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    navigate={navigate}
                    permissions={{}}
                />

                {/* Main Content Scroll Area */}
                <main ref={mainContentRef} className="layout-mainContentScroll p-4 sm:p-6 md:p-8 lg:p-10">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>

            </motion.div>
            {/* Scroll-to-top/bottom buttons */}
            {showScrollButtons && (
                <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2 no-print">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="!rounded-full !p-2 shadow-lg"
                        onClick={handleScrollUp}
                        onMouseEnter={autoScrollOnHover ? () => startPageScrolling('up') : undefined}
                        onMouseLeave={stopPageScrolling}
                        disabled={scrollPosition <= 0}
                        aria-label="Scroll Up"
                    >
                        <ChevronUp className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="!rounded-full !p-2 shadow-lg"
                        onClick={handleScrollDown}
                        onMouseEnter={autoScrollOnHover ? () => startPageScrolling('down') : undefined}
                        onMouseLeave={stopPageScrolling}
                        disabled={mainContentRef.current ? Math.ceil(mainContentRef.current.clientHeight + scrollPosition) >= mainContentRef.current.scrollHeight : false}
                        aria-label="Scroll Down"
                    >
                        <ChevronDown className="h-5 w-5" />
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default MindmeshLayout;
