import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, useState, useEffect } from 'react';
import { AccessibleAlert } from './AccessibleComponents';
import { useAnnounce, AriaUtils } from '../hooks/useAccessibility';
import { cn } from '@/lib/utils';

// 🎯 Types pour les formulaires accessibles
interface BaseFieldProps {
  label: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  help?: string;
  className?: string;
  labelClassName?: string;
}

interface AccessibleInputProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {}
interface AccessibleTextareaProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {}
interface AccessibleSelectProps extends BaseFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  children: React.ReactNode;
  placeholder?: string;
}

// 🎯 Hook pour gestion des formulaires accessibles
export const useAccessibleForm = () => {
  const { announce } = useAnnounce();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setFieldError = (fieldName: string, error: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }));
    announce(AriaUtils.formatErrorMessage(fieldName, error), 'assertive');
  };

  const clearFieldError = (fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const setFieldTouched = (fieldName: string, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [fieldName]: isTouched }));
  };

  const clearAllErrors = () => {
    setErrors({});
    setTouched({});
  };

  const hasErrors = Object.keys(errors).length > 0;
  const getFieldError = (fieldName: string) => touched[fieldName] ? errors[fieldName] : undefined;

  return {
    errors,
    touched,
    hasErrors,
    setFieldError,
    clearFieldError,
    setFieldTouched,
    clearAllErrors,
    getFieldError
  };
};

// 🎯 Input accessible WCAG 2.1 AA
export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({
    label,
    id: providedId,
    required = false,
    disabled = false,
    error,
    help,
    className,
    labelClassName,
    type = 'text',
    onBlur,
    onChange,
    onFocus,
    ...props
  }, ref) => {
    const id = providedId || AriaUtils.generateId('input');
    const errorId = error ? `${id}-error` : undefined;
    const helpId = help ? `${id}-help` : undefined;
    const describedBy = AriaUtils.buildDescription([errorId, helpId]);

    return (
      <div className={className}>
        {/* Label */}
        <label 
          htmlFor={id}
          className={cn(
            'block text-sm font-medium wcag-text-primary mb-1',
            required && 'after:content-["*"] after:ml-1 after:text-red-500',
            disabled && 'opacity-60',
            labelClassName
          )}
        >
          {label}
          {required && (
            <span className="sr-only">(requis)</span>
          )}
        </label>

        {/* Help text */}
        {help && (
          <p 
            id={helpId}
            className="text-sm wcag-text-secondary mb-1"
          >
            {help}
          </p>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={id}
          type={type}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          className={cn(
            'wcag-form-input w-full',
            error && 'border-wcag-error-border focus:ring-red-500',
            disabled && 'bg-gray-50 cursor-not-allowed',
            'transition-colors duration-200'
          )}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          {...props}
        />

        {/* Error message */}
        {error && (
          <p 
            id={errorId}
            role="alert"
            className="wcag-error-message"
            aria-live="polite"
          >
            <span className="sr-only">Erreur :</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

// 🎯 Textarea accessible
export const AccessibleTextarea = forwardRef<HTMLTextAreaElement, AccessibleTextareaProps>(
  ({
    label,
    id: providedId,
    required = false,
    disabled = false,
    error,
    help,
    className,
    labelClassName,
    rows = 3,
    onBlur,
    onChange,
    onFocus,
    ...props
  }, ref) => {
    const id = providedId || AriaUtils.generateId('textarea');
    const errorId = error ? `${id}-error` : undefined;
    const helpId = help ? `${id}-help` : undefined;
    const describedBy = AriaUtils.buildDescription([errorId, helpId]);

    return (
      <div className={className}>
        <label 
          htmlFor={id}
          className={cn(
            'block text-sm font-medium wcag-text-primary mb-1',
            required && 'after:content-["*"] after:ml-1 after:text-red-500',
            disabled && 'opacity-60',
            labelClassName
          )}
        >
          {label}
          {required && <span className="sr-only">(requis)</span>}
        </label>

        {help && (
          <p id={helpId} className="text-sm wcag-text-secondary mb-1">
            {help}
          </p>
        )}

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          className={cn(
            'wcag-form-input w-full resize-vertical',
            error && 'border-wcag-error-border focus:ring-red-500',
            disabled && 'bg-gray-50 cursor-not-allowed'
          )}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          {...props}
        />

        {error && (
          <p 
            id={errorId}
            role="alert"
            className="wcag-error-message"
            aria-live="polite"
          >
            <span className="sr-only">Erreur :</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleTextarea.displayName = 'AccessibleTextarea';

// 🎯 Select accessible
export const AccessibleSelect = forwardRef<HTMLSelectElement, AccessibleSelectProps>(
  ({
    label,
    id: providedId,
    required = false,
    disabled = false,
    error,
    help,
    className,
    labelClassName,
    placeholder,
    children,
    onBlur,
    onChange,
    onFocus,
    ...props
  }, ref) => {
    const id = providedId || AriaUtils.generateId('select');
    const errorId = error ? `${id}-error` : undefined;
    const helpId = help ? `${id}-help` : undefined;
    const describedBy = AriaUtils.buildDescription([errorId, helpId]);

    return (
      <div className={className}>
        <label 
          htmlFor={id}
          className={cn(
            'block text-sm font-medium wcag-text-primary mb-1',
            required && 'after:content-["*"] after:ml-1 after:text-red-500',
            disabled && 'opacity-60',
            labelClassName
          )}
        >
          {label}
          {required && <span className="sr-only">(requis)</span>}
        </label>

        {help && (
          <p id={helpId} className="text-sm wcag-text-secondary mb-1">
            {help}
          </p>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={id}
            required={required}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={describedBy || undefined}
            className={cn(
              'wcag-form-input w-full appearance-none cursor-pointer',
              error && 'border-wcag-error-border focus:ring-red-500',
              disabled && 'bg-gray-50 cursor-not-allowed'
            )}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>

          {/* Icône de dropdown */}
          <div 
            className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            aria-hidden="true"
          >
            <svg className="h-4 w-4 wcag-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error && (
          <p 
            id={errorId}
            role="alert"
            className="wcag-error-message"
            aria-live="polite"
          >
            <span className="sr-only">Erreur :</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleSelect.displayName = 'AccessibleSelect';

// 🎯 Checkbox accessible
interface AccessibleCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  label: string;
  id?: string;
  description?: string;
  error?: string;
}

export const AccessibleCheckbox = forwardRef<HTMLInputElement, AccessibleCheckboxProps>(
  ({
    label,
    id: providedId,
    description,
    error,
    disabled = false,
    className,
    ...props
  }, ref) => {
    const id = providedId || AriaUtils.generateId('checkbox');
    const descriptionId = description ? `${id}-description` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = AriaUtils.buildDescription([descriptionId, errorId]);

    return (
      <div className={className}>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={describedBy || undefined}
              className={cn(
                'h-4 w-4 rounded border-gray-300 wcag-text-primary',
                'focus:ring-2 focus:ring-wcag-focus-ring focus:ring-offset-2',
                error && 'border-wcag-error-border',
                disabled && 'opacity-60 cursor-not-allowed',
                'cursor-pointer'
              )}
              {...props}
            />
          </div>
          <div className="ml-3">
            <label 
              htmlFor={id}
              className={cn(
                'text-sm font-medium wcag-text-primary cursor-pointer',
                disabled && 'opacity-60 cursor-not-allowed'
              )}
            >
              {label}
            </label>
            {description && (
              <p 
                id={descriptionId}
                className="text-sm wcag-text-secondary mt-1"
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {error && (
          <p 
            id={errorId}
            role="alert"
            className="wcag-error-message mt-1"
            aria-live="polite"
          >
            <span className="sr-only">Erreur :</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleCheckbox.displayName = 'AccessibleCheckbox';

// 🎯 Radio Group accessible
interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface AccessibleRadioGroupProps {
  name: string;
  label: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  help?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const AccessibleRadioGroup: React.FC<AccessibleRadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  error,
  help,
  required = false,
  disabled = false,
  className
}) => {
  const groupId = AriaUtils.generateId('radio-group');
  const errorId = error ? `${groupId}-error` : undefined;
  const helpId = help ? `${groupId}-help` : undefined;
  const describedBy = AriaUtils.buildDescription([helpId, errorId]);

  return (
    <fieldset 
      className={className}
      aria-invalid={!!error}
      aria-describedby={describedBy || undefined}
    >
      <legend className={cn(
        'text-sm font-medium wcag-text-primary mb-2',
        required && 'after:content-["*"] after:ml-1 after:text-red-500'
      )}>
        {label}
        {required && <span className="sr-only">(requis)</span>}
      </legend>

      {help && (
        <p id={helpId} className="text-sm wcag-text-secondary mb-3">
          {help}
        </p>
      )}

      <div className="space-y-2">
        {options.map((option, index) => {
          const optionId = `${groupId}-option-${index}`;
          const isOptionDisabled = disabled || option.disabled;
          
          return (
            <div key={option.value} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={optionId}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  disabled={isOptionDisabled}
                  onChange={(e) => onChange(e.target.value)}
                  className={cn(
                    'h-4 w-4 border-gray-300 wcag-text-primary',
                    'focus:ring-2 focus:ring-wcag-focus-ring focus:ring-offset-2',
                    error && 'border-wcag-error-border',
                    isOptionDisabled && 'opacity-60 cursor-not-allowed',
                    'cursor-pointer'
                  )}
                />
              </div>
              <div className="ml-3">
                <label 
                  htmlFor={optionId}
                  className={cn(
                    'text-sm font-medium wcag-text-primary cursor-pointer',
                    isOptionDisabled && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-sm wcag-text-secondary mt-1">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <p 
          id={errorId}
          role="alert"
          className="wcag-error-message mt-2"
          aria-live="polite"
        >
          <span className="sr-only">Erreur :</span>
          {error}
        </p>
      )}
    </fieldset>
  );
};

// 🎯 Formulaire accessible avec validation
interface AccessibleFormProps {
  children: React.ReactNode;
  onSubmit: (event: React.FormEvent) => void;
  noValidate?: boolean;
  className?: string;
  title?: string;
}

export const AccessibleForm: React.FC<AccessibleFormProps> = ({
  children,
  onSubmit,
  noValidate = true,
  className,
  title
}) => {
  const { announce } = useAnnounce();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Vérifier les erreurs de validation native
    const form = event.currentTarget as HTMLFormElement;
    const firstInvalidField = form.querySelector(':invalid') as HTMLElement;
    
    if (firstInvalidField) {
      firstInvalidField.focus();
      announce('Veuillez corriger les erreurs dans le formulaire', 'assertive');
      return;
    }

    onSubmit(event);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate={noValidate}
      className={className}
      role="form"
      aria-label={title}
    >
      {children}
    </form>
  );
};