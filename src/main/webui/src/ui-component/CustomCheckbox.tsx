interface CustomCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    colorScheme?: 'indigo' | 'blue' | 'green' | 'yellow' | 'red';
}

export function CustomCheckbox({ 
    checked, 
    onChange, 
    disabled = false, 
    className = '',
    colorScheme = 'blue'
}: CustomCheckboxProps) {
    const colorClasses = {
        indigo: {
            border: 'border-indigo-400',
            checked: 'bg-indigo-600 border-indigo-600',
            focus: 'focus:ring-indigo-500'
        },
        blue: {
            border: 'border-blue-400',
            checked: 'bg-blue-600 border-blue-600',
            focus: 'focus:ring-blue-500'
        },
        green: {
            border: 'border-green-400',
            checked: 'bg-green-600 border-green-600',
            focus: 'focus:ring-green-500'
        },
        yellow: {
            border: 'border-yellow-400',
            checked: 'bg-yellow-600 border-yellow-600',
            focus: 'focus:ring-yellow-500'
        },
        red: {
            border: 'border-red-400',
            checked: 'bg-red-600 border-red-600',
            focus: 'focus:ring-red-500'
        }
    };

    const colors = colorClasses[colorScheme];

    return (
        <div 
            className={`
                relative inline-flex items-center justify-center
                h-5 w-5 rounded border-2 cursor-pointer
                transition-all duration-200 ease-in-out
                ${checked ? colors.checked : `bg-transparent ${colors.border}`}
                ${!disabled ? `hover:scale-105 ${colors.focus} focus:ring-2 focus:ring-offset-0` : 'opacity-50 cursor-not-allowed'}
                ${className}
            `}
            onClick={() => !disabled && onChange(!checked)}
            onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    !disabled && onChange(!checked);
                }
            }}
            tabIndex={disabled ? -1 : 0}
            role="checkbox"
            aria-checked={checked}
            aria-disabled={disabled}
        >
            {checked && (
                <span className="text-white text-xs font-bold select-none">
                    :3
                </span>
            )}
        </div>
    );
}
