import React from 'react';

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  const handleToggleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={handleToggleChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-mindmesh-primary focus:ring-offset-2
          ${checked ? 'bg-mindmesh-primary' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
      {label && (
        <label htmlFor={id} className="ml-3 text-sm font-medium text-mindmesh-text cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
};

export default ToggleSwitch;