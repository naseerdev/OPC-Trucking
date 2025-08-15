import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'dark' | 'transparent';
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonProps) => {
  const baseClasses = 'rounded-lg font-medium transition-all cursor-pointer';

  const variantClasses = {
    primary: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900',
    secondary: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900',
    danger: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900',
    dark: 'bg-gray-900 hover:bg-gray-800 text-yellow-400',
    transparent: 'bg-transparent px-0',
  };

  const sizeClasses = {
    sm: 'py-2.5 lg:py-3 px-3 text-sm lg:text-base',
    md: 'py-3 px-4 text-base',
    lg: 'py-3 px-6 text-base',
    full: 'py-3 w-full text-base',
  };

  return (
    <button
      type="submit"
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
