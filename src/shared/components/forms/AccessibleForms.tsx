import React, { forwardRef, ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, hint, required = false, children, className }, ref) => {
    const fieldId = useId();
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;

    // Cloner l'enfant pour ajouter les attributs d'accessibilité
    const childElement = React.Children.only(children) as React.ReactElement;
    const accessibleChild = React.cloneElement(childElement, {
      id: fieldId,
      'aria-describedby': [
        hint ? hintId : null,
        error ? errorId : null
      ].filter(Boolean).join(' ') || undefined,
      'aria-invalid': !!error,
      'aria-required': required,
      ...childElement.props
    });

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        <label 
          htmlFor={fieldId}
          className={cn(
            'block text-sm font-medium text-text-primary',
            required && "after:content-['*'] after:ml-1 after:text-red-500"
          )}
        >
          {label}
          {required && (
            <span className="sr-only">(requis)</span>
          )}
        </label>

        {hint && (
          <p 
            id={hintId}
            className="text-sm text-text-secondary"
            aria-live="polite"
          >
            {hint}
          </p>
        )}

        {accessibleChild}

        {error && (
          <div 
            id={errorId}
            role="alert"
            aria-live="assertive"
            className="flex items-center space-x-2 text-sm text-red-600"
          >
            <svg 
              className="w-4 h-4 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseClasses = cn(
      // Base styles
      'w-full px-3 py-2 text-sm border rounded-md transition-colors duration-200',
      'placeholder:text-text-disabled',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      
      // Variant styles
      {
        'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20': variant === 'default',
        'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50': variant === 'error',
        'border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50': variant === 'success',
      },
      
      // Disabled state
      'disabled:bg-gray-100 disabled:border-gray-200 disabled:text-text-disabled disabled:cursor-not-allowed',
      
      className
    );

    return (
      <input
        ref={ref}
        className={baseClasses}
        {...props}
      />
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'error' | 'success';
}

export const AccessibleTextarea = forwardRef<HTMLTextAreaElement, AccessibleTextareaProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseClasses = cn(
      // Base styles
      'w-full px-3 py-2 text-sm border rounded-md transition-colors duration-200 resize-vertical',
      'placeholder:text-text-disabled min-h-[80px]',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      
      // Variant styles
      {
        'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20': variant === 'default',
        'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50': variant === 'error',
        'border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50': variant === 'success',
      },
      
      // Disabled state
      'disabled:bg-gray-100 disabled:border-gray-200 disabled:text-text-disabled disabled:cursor-not-allowed',
      
      className
    );

    return (
      <textarea
        ref={ref}
        className={baseClasses}
        {...props}
      />
    );
  }
);

AccessibleTextarea.displayName = 'AccessibleTextarea';

interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'error' | 'success';
  placeholder?: string;
}

export const AccessibleSelect = forwardRef<HTMLSelectElement, AccessibleSelectProps>(
  ({ className, variant = 'default', placeholder, children, ...props }, ref) => {
    const baseClasses = cn(
      // Base styles
      'w-full px-3 py-2 text-sm border rounded-md transition-colors duration-200 bg-white',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      
      // Variant styles
      {
        'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20': variant === 'default',
        'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50': variant === 'error',
        'border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50': variant === 'success',
      },
      
      // Disabled state
      'disabled:bg-gray-100 disabled:border-gray-200 disabled:text-text-disabled disabled:cursor-not-allowed',
      
      className
    );

    return (
      <select
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    );
  }
);

AccessibleSelect.displayName = 'AccessibleSelect';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export const AccessibleCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, ...props }, ref) => {
    const id = useId();
    const descriptionId = description ? `${id}-description` : undefined;

    return (
      <div className={cn('flex items-start space-x-3', className)}>
        <input
          ref={ref}
          type="checkbox"
          id={id}
          aria-describedby={descriptionId}
          className={cn(
            'mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded transition-colors duration-200',
            'focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          {...props}
        />
        <div className="flex-1">
          <label 
            htmlFor={id}
            className="text-sm font-medium text-text-primary cursor-pointer"
          >
            {label}
          </label>
          {description && (
            <p 
              id={descriptionId}
              className="text-sm text-text-secondary mt-1"
            >
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

AccessibleCheckbox.displayName = 'AccessibleCheckbox';

interface RadioGroupProps {
  name: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export const AccessibleRadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ name, label, options, value, onChange, error, required, className }, ref) => {
    const groupId = useId();
    const errorId = error ? `${groupId}-error` : undefined;

    return (
      <fieldset 
        ref={ref}
        className={cn('space-y-3', className)}
        aria-describedby={errorId}
        aria-invalid={!!error}
        aria-required={required}
      >
        <legend className={cn(
          'text-sm font-medium text-text-primary',
          required && "after:content-['*'] after:ml-1 after:text-red-500"
        )}>
          {label}
          {required && (
            <span className="sr-only">(requis)</span>
          )}
        </legend>

        <div className="space-y-2" role="radiogroup" aria-labelledby={groupId}>
          {options.map((option, index) => {
            const optionId = `${groupId}-option-${index}`;
            const descriptionId = option.description ? `${optionId}-description` : undefined;

            return (
              <div key={option.value} className="flex items-start space-x-3">
                <input
                  type="radio"
                  id={optionId}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange?.(e.target.value)}
                  aria-describedby={descriptionId}
                  className={cn(
                    'mt-1 w-4 h-4 text-blue-600 border-gray-300 transition-colors duration-200',
                    'focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1'
                  )}
                />
                <div className="flex-1">
                  <label 
                    htmlFor={optionId}
                    className="text-sm font-medium text-text-primary cursor-pointer"
                  >
                    {option.label}
                  </label>
                  {option.description && (
                    <p 
                      id={descriptionId}
                      className="text-sm text-text-secondary mt-1"
                    >
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div 
            id={errorId}
            role="alert"
            aria-live="assertive"
            className="flex items-center space-x-2 text-sm text-red-600"
          >
            <svg 
              className="w-4 h-4 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </fieldset>
    );
  }
);

AccessibleRadioGroup.displayName = 'AccessibleRadioGroup';