import { Link } from 'react-router-dom';

/**
 * Button Component
 * @param {string} variant - 'primary', 'outline', 'ghost', 'danger', 'white'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} isLoading - Show loading spinner
 * @param {boolean} fullWidth - 100% width
 * @param {string} to - URL to link to (optional)
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    className = '',
    type = 'button',
    onClick,
    disabled,
    to,
    ...props
}) => {

    // Base styles
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

    // Size styles
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-2.5 text-base",
        lg: "px-8 py-3.5 text-lg font-bold"
    };

    // Variant styles
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 border border-transparent",
        outline: "bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-50",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30",
        white: "bg-white text-blue-600 hover:bg-gray-50 border border-gray-200 shadow-sm"
    };

    // Width style
    const widthStyle = fullWidth ? "w-full" : "";

    const combinedClassName = `
        ${baseStyles} 
        ${sizes[size]} 
        ${variants[variant]} 
        ${widthStyle} 
        ${className}
    `;

    if (to) {
        return (
            <Link to={to} className={combinedClassName} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={combinedClassName}
            onClick={onClick}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;
