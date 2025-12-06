import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../../store/notificationStore';
import { Bell, UserPlus, AlertTriangle, ClipboardCheck, Sunrise, Sun, Sunset } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Notification, NotificationType } from '../../types/mindmesh';
import Button from '../ui/Button';
import { useAuth } from '../../store/AuthContext';

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
    const iconMap: Record<NotificationType, React.ElementType> = {
        task_assigned: UserPlus,
        task_escalated: AlertTriangle,
        provisional_site_reminder: ClipboardCheck,
        support_ticket_update: AlertTriangle,
    };
    const colorMap: Record<NotificationType, string> = {
        task_assigned: 'text-blue-500',
        task_escalated: 'text-orange-500',
        provisional_site_reminder: 'text-purple-500',
        support_ticket_update: 'text-green-500',
    };
    const Icon = iconMap[type] || Bell;
    return <Icon className={`h-5 w-5 ${colorMap[type]}`} />;
};

// Helper to get time-based greeting with professional blue gradients
const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return {
            text: 'Good Morning',
            icon: Sunrise,
            gradient: 'from-sky-400 via-blue-400 to-indigo-400'
        };
    } else if (hour >= 12 && hour < 18) {
        return {
            text: 'Good Afternoon',
            icon: Sun,
            gradient: 'from-blue-400 via-sky-500 to-cyan-400'
        };
    } else {
        return {
            text: 'Good Evening',
            icon: Sunset,
            gradient: 'from-indigo-500 via-blue-500 to-sky-500'
        };
    }
};

const NotificationBell: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
    const { user, profile } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [greeting, setGreeting] = useState(getGreeting());
    const panelRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update greeting when dropdown opens
    useEffect(() => {
        if (isOpen) {
            setGreeting(getGreeting());
        }
    }, [isOpen]);

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        if (notification.linkTo) {
            navigate(notification.linkTo);
        }
        setIsOpen(false);
    };

    const handleMarkAll = () => {
        markAllAsRead();
    }

    return (
        <div className={`relative notification-bell ${className}`} ref={panelRef}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-page text-muted transition-colors"
                aria-label={`Notifications (${unreadCount} unread)`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    animate={unreadCount > 0 ? { rotate: [0, -15, 15, -15, 0] } : {}}
                    transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
                >
                    <Bell className="h-5 w-5" />
                </motion.div>
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.div
                            className="absolute -top-1 -right-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                        >
                            {/* Pulsing ring effect */}
                            <motion.span
                                className="absolute inset-0 rounded-full bg-red-500"
                                animate={{ scale: [1, 1.5, 1.5], opacity: [0.7, 0, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            {/* Badge */}
                            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-[10px] font-bold text-white shadow-lg ring-2 ring-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute right-4 md:right-0 mt-3 w-[calc(100vw-2.5rem)] max-w-sm md:w-96 bg-card backdrop-blur-md bg-opacity-100 rounded-2xl shadow-2xl border border-border z-20 overflow-hidden"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        {/* Greeting Header Section */}
                        <motion.div
                            className={`p-4 bg-gradient-to-br ${greeting.gradient} text-white relative overflow-hidden`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

                            <div className="relative flex items-center gap-3">
                                <motion.div
                                    className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                                >
                                    {React.createElement(greeting.icon, { className: 'h-7 w-7 text-white' })}
                                </motion.div>
                                <div className="flex-1">
                                    <motion.p
                                        className="text-sm font-medium text-white/90"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {greeting.text}
                                    </motion.p>
                                    <motion.h3
                                        className="text-lg font-bold text-white"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {profile?.full_name || profile?.name || user?.email?.split('@')[0] || 'User'}
                                    </motion.h3>
                                </div>
                            </div>
                        </motion.div>

                        {/* Notifications Header */}
                        <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-gradient-to-r from-sky-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
                            <h4 className="font-semibold text-primary-text flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="ml-1 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </h4>
                            {unreadCount > 0 && (
                                <Button variant="outline" size="sm" onClick={handleMarkAll}>
                                    Mark all as read
                                </Button>
                            )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: {},
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05
                                            }
                                        }
                                    }}
                                >
                                    {notifications.map((notif) => (
                                        <motion.div
                                            key={notif.id}
                                            onClick={() => handleNotificationClick(notif)}
                                            className={`flex items-start gap-3 p-4 border-b border-border cursor-pointer transition-all duration-200 ${!notif.isRead
                                                    ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                            variants={{
                                                hidden: { opacity: 0, x: -20 },
                                                visible: { opacity: 1, x: 0 }
                                            }}
                                            whileHover={{ x: 4 }}
                                        >
                                            <div className="flex-shrink-0 mt-0.5">
                                                <NotificationIcon type={notif.type} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${!notif.isRead ? 'font-semibold text-primary-text' : 'text-primary-text'}`}>
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs text-muted mt-1">
                                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            {!notif.isRead && (
                                                <motion.div
                                                    className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                                />
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="text-center p-8"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                    <p className="text-muted">You have no notifications.</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;