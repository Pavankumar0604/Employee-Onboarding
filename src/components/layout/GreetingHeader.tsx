import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sun, Sunset } from 'lucide-react';

interface GreetingHeaderProps {
    userName: string | null;
    className?: string;
}

const GreetingHeader: React.FC<GreetingHeaderProps> = ({ userName, className = '' }) => {
    const [greeting, setGreeting] = useState<{
        text: string;
        icon: React.ElementType;
        gradient: string;
    }>({
        text: 'Good Morning',
        icon: Sunrise,
        gradient: 'from-orange-400 to-pink-500'
    });

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();

            if (hour >= 5 && hour < 12) {
                setGreeting({
                    text: 'Good Morning',
                    icon: Sunrise,
                    gradient: 'from-orange-400 to-pink-500'
                });
            } else if (hour >= 12 && hour < 18) {
                setGreeting({
                    text: 'Good Afternoon',
                    icon: Sun,
                    gradient: 'from-yellow-400 to-orange-500'
                });
            } else {
                setGreeting({
                    text: 'Good Evening',
                    icon: Sunset,
                    gradient: 'from-purple-400 to-pink-500'
                });
            }
        };

        updateGreeting();
        // Update greeting every minute to catch time changes
        const interval = setInterval(updateGreeting, 60000);

        return () => clearInterval(interval);
    }, []);

    const Icon = greeting.icon;
    const displayName = userName || 'User';

    return (
        <motion.div
            className={`flex items-center gap-2 ${className}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <motion.div
                className={`p-2 rounded-full bg-gradient-to-br ${greeting.gradient} bg-opacity-10`}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
                <Icon className={`h-5 w-5 bg-gradient-to-br ${greeting.gradient} bg-clip-text text-transparent`} style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
            </motion.div>
            <div className="flex flex-col">
                <motion.p
                    className="text-xs text-gray-500 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {greeting.text}
                </motion.p>
                <motion.h2
                    className={`text-sm font-bold bg-gradient-to-r ${greeting.gradient} bg-clip-text text-transparent`}
                    style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {displayName}
                </motion.h2>
            </div>
        </motion.div>
    );
};

export default GreetingHeader;
