import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 lg:py-3 border-2 rounded-lg focus:ring-2 focus:outline-none text-gray-900 text-sm leading-4 lg:text-base lg:leading-5 font-medium  ${
          error
            ? 'border-red-300 focus:ring-4 focus:ring-red-200 focus:border-red-300 text-red-300'
            : 'border-gray-300 rounded-lg focus:ring-5 focus:ring-[#FCD54C66] focus:border-yellow-400'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-2 text-xs font-medium italic text-red-300 font-">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';

export default Input;
