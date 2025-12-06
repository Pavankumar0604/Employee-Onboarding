import React from 'react';

interface AdminPageHeaderProps {
    title: string;
    children?: React.ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ title, children }) => {
    return (
        <header className="flex justify-between items-center p-4 mb-6 border-b pb-4 border-border">
            <h1 className="text-2xl font-bold text-primary-text">{title}</h1>
            {children && <div>{children}</div>}
        </header>
    );
};

export default AdminPageHeader;