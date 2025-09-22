import React from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { SignupFormData, ValidationErrors } from '@/features/auth/hooks/useSignupValidation';

interface FormFieldProps {
  type: string;
  name: keyof SignupFormData;
  placeholder: string;
  value: string;
  error?: string;
  icon: React.ReactNode;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  onChange: (value: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  type,
  name,
  placeholder,
  value,
  error,
  icon,
  showPassword,
  onTogglePassword,
  onChange
}) => {
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {type === 'password' && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

interface SignupFormFieldsProps {
  formData: SignupFormData;
  errors: ValidationErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  passwordStrength: { strength: number; label: string; color: string };
  onFieldChange: (name: keyof SignupFormData, value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

export const SignupFormFields: React.FC<SignupFormFieldsProps> = ({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  passwordStrength,
  onFieldChange,
  onTogglePassword,
  onToggleConfirmPassword
}) => {
  return (
    <>
      {/* Prénom */}
      <FormField
        type="text"
        name="firstName"
        placeholder="Prénom"
        value={formData.firstName}
        error={errors.firstName}
        icon={<User className="h-4 w-4" />}
        onChange={(value) => onFieldChange('firstName', value)}
      />

      {/* Nom */}
      <FormField
        type="text"
        name="lastName"
        placeholder="Nom"
        value={formData.lastName}
        error={errors.lastName}
        icon={<User className="h-4 w-4" />}
        onChange={(value) => onFieldChange('lastName', value)}
      />

      {/* Email */}
      <FormField
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        error={errors.email}
        icon={<Mail className="h-4 w-4" />}
        onChange={(value) => onFieldChange('email', value)}
      />

      {/* Mot de passe */}
      <div>
        <FormField
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          error={errors.password}
          icon={<Lock className="h-4 w-4" />}
          showPassword={showPassword}
          onTogglePassword={onTogglePassword}
          onChange={(value) => onFieldChange('password', value)}
        />
        
        {/* Indicateur de force du mot de passe */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Force du mot de passe</span>
              <span className={`text-xs font-medium ${
                passwordStrength.strength <= 25 ? 'text-red-600' :
                passwordStrength.strength <= 50 ? 'text-orange-600' :
                passwordStrength.strength <= 75 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                style={{ width: `${passwordStrength.strength}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Confirmation mot de passe */}
      <FormField
        type="password"
        name="confirmPassword"
        placeholder="Confirmer le mot de passe"
        value={formData.confirmPassword}
        error={errors.confirmPassword}
        icon={<Lock className="h-4 w-4" />}
        showPassword={showConfirmPassword}
        onTogglePassword={onToggleConfirmPassword}
        onChange={(value) => onFieldChange('confirmPassword', value)}
      />
    </>
  );
};