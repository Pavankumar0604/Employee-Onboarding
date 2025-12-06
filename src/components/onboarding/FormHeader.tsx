import React from 'react';

interface FormHeaderProps {
  title: string;
  subtitle?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => (
  <header className="mb-6 border-b pb-2">
    <h2 className="text-xl font-semibold">{title}</h2>
    {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
  </header>
);

export default FormHeader;