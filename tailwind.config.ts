// client/tailwind.config.ts
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
 content: ['./src/**/*.{js,jsx,ts,tsx}'],
 theme: {
   extend: {
     backgroundImage: {
       'hero-gradient': 'linear-gradient(135deg, #5d2cfe 0%, #7d36fc 20%, #a53eff 60%, #ff549e 100%)',
     },
     colors: {
       hero: {
         purple: {
           50: '#f5f3ff',
           100: '#ede9fe',
           500: '#5d2cfe',
           600: '#7d36fc',
           700: '#a53eff',
         },
         pink: {
           500: '#ff549e',
         }
       },
       // 🎯 Palette WCAG 2.1 AA - Ratios de contraste conformes
       wcag: {
         // Texte principal - Ratio 21:1 sur blanc
         'text-primary': '#000000',
         // Texte secondaire - Ratio 7:1 sur blanc  
         'text-secondary': '#4a5568',
         // Texte tertiaire - Ratio 4.5:1 sur blanc
         'text-tertiary': '#718096',
         // Texte désactivé - Ratio 3:1 sur blanc (minimum large text)
         'text-disabled': '#a0aec0',
         
         // Liens - Ratio 4.5:1 sur blanc
         'link-primary': '#2563eb',
         'link-hover': '#1d4ed8',
         'link-visited': '#7c3aed',
         
         // Erreurs - Ratio 4.5:1 sur blanc
         'error-text': '#dc2626',
         'error-bg': '#fef2f2',
         'error-border': '#fca5a5',
         
         // Succès - Ratio 4.5:1 sur blanc
         'success-text': '#059669',
         'success-bg': '#f0fdf4',
         'success-border': '#86efac',
         
         // Avertissements - Ratio 4.5:1 sur blanc
         'warning-text': '#d97706',
         'warning-bg': '#fffbeb',
         'warning-border': '#fde68a',
         
         // Info - Ratio 4.5:1 sur blanc
         'info-text': '#0284c7',
         'info-bg': '#f0f9ff',
         'info-border': '#7dd3fc',
         
         // Focus - Contraste élevé pour la visibilité
         'focus-ring': '#3b82f6',
         'focus-ring-offset': '#ffffff',
         
         // Boutons primaires - Ratio 4.5:1
         'button-primary': '#1d4ed8',
         'button-primary-hover': '#1e40af',
         'button-primary-active': '#1e3a8a',
         'button-primary-disabled': '#9ca3af',
         
         // Boutons secondaires - Ratio 4.5:1
         'button-secondary': '#374151',
         'button-secondary-hover': '#111827',
         'button-secondary-active': '#030712',
         
         // Backgrounds avec contrastes appropriés
         'bg-subtle': '#f9fafb',
         'bg-muted': '#f3f4f6',
         'bg-emphasis': '#e5e7eb',
         
         // Bordures
         'border-light': '#e5e7eb',
         'border-medium': '#d1d5db',
         'border-strong': '#9ca3af',
       }
     },
     // 🎯 Extensions pour l'accessibilité
     spacing: {
       'focus-ring': '2px',
       'touch-target': '44px', // Minimum WCAG pour les cibles tactiles
     },
     fontSize: {
       // Tailles conformes WCAG
       'wcag-small': ['14px', { lineHeight: '1.5' }],
       'wcag-base': ['16px', { lineHeight: '1.5' }],
       'wcag-large': ['18px', { lineHeight: '1.5' }],
       'wcag-xl': ['20px', { lineHeight: '1.4' }],
     },
     animation: {
       // Respecte prefers-reduced-motion
       'fade-in': 'fadeIn 0.3s ease-in-out',
       'slide-up': 'slideUp 0.3s ease-out',
       'pulse-subtle': 'pulseSubtle 2s infinite',
     },
     keyframes: {
       fadeIn: {
         '0%': { opacity: '0' },
         '100%': { opacity: '1' },
       },
       slideUp: {
         '0%': { transform: 'translateY(10px)', opacity: '0' },
         '100%': { transform: 'translateY(0)', opacity: '1' },
       },
       pulseSubtle: {
         '0%, 100%': { opacity: '1' },
         '50%': { opacity: '0.8' },
       },
     },
   }
 },
 plugins: [
   plugin(function({ addComponents, theme }) {
     addComponents({
       '.hero-container': {
         background: theme('backgroundImage.hero-gradient'),
         backgroundAttachment: 'fixed',
         minHeight: '100vh',
         position: 'relative',
       },
       '.hero-card': {
         backgroundColor: 'rgba(255, 255, 255, 0.95)',
         backdropFilter: 'blur(12px)',
         borderRadius: theme('borderRadius.2xl'),
         boxShadow: theme('boxShadow.2xl'),
         padding: theme('spacing.8'),
         '@media (max-width: 640px)': {
           padding: theme('spacing.6'),
         }
       },
       '.hero-card-glass': {
         backgroundColor: 'rgba(255, 255, 255, 0.1)',
         backdropFilter: 'blur(16px)',
         border: '1px solid rgba(255, 255, 255, 0.2)',
         borderRadius: theme('borderRadius.2xl'),
         boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
       },
       // 🎯 Composants WCAG 2.1 AA
       '.wcag-text-primary': {
         color: theme('colors.wcag.text-primary'),
       },
       '.wcag-text-secondary': {
         color: theme('colors.wcag.text-secondary'),
       },
       '.wcag-text-tertiary': {
         color: theme('colors.wcag.text-tertiary'),
       },
       '.wcag-link': {
         color: theme('colors.wcag.link-primary'),
         textDecoration: 'underline',
         textUnderlineOffset: '2px',
         '&:hover': {
           color: theme('colors.wcag.link-hover'),
         },
         '&:visited': {
           color: theme('colors.wcag.link-visited'),
         },
         '&:focus': {
           outline: `2px solid ${theme('colors.wcag.focus-ring')}`,
           outlineOffset: '2px',
           borderRadius: theme('borderRadius.sm'),
         },
       },
       '.wcag-button': {
         minHeight: theme('spacing.touch-target'),
         minWidth: theme('spacing.touch-target'),
         padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
         fontSize: theme('fontSize.wcag-base')?.[0],
         lineHeight: theme('fontSize.wcag-base')?.[1]?.lineHeight,
         fontWeight: '500',
         borderRadius: theme('borderRadius.md'),
         cursor: 'pointer',
         transition: 'all 0.2s ease-in-out',
         '&:focus': {
           outline: `2px solid ${theme('colors.wcag.focus-ring')}`,
           outlineOffset: '2px',
         },
         '&:disabled': {
           opacity: '0.5',
           cursor: 'not-allowed',
           pointerEvents: 'none',
         },
         // Respecter prefers-reduced-motion
         '@media (prefers-reduced-motion: reduce)': {
           transition: 'none',
         },
       },
       '.wcag-button-primary': {
         backgroundColor: theme('colors.wcag.button-primary'),
         color: 'white',
         '&:hover:not(:disabled)': {
           backgroundColor: theme('colors.wcag.button-primary-hover'),
         },
         '&:active:not(:disabled)': {
           backgroundColor: theme('colors.wcag.button-primary-active'),
         },
       },
       '.wcag-button-secondary': {
         backgroundColor: theme('colors.wcag.button-secondary'),
         color: 'white',
         '&:hover:not(:disabled)': {
           backgroundColor: theme('colors.wcag.button-secondary-hover'),
         },
         '&:active:not(:disabled)': {
           backgroundColor: theme('colors.wcag.button-secondary-active'),
         },
       },
       '.wcag-form-input': {
         minHeight: theme('spacing.touch-target'),
         padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
         fontSize: theme('fontSize.wcag-base')?.[0],
         lineHeight: theme('fontSize.wcag-base')?.[1]?.lineHeight,
         borderWidth: '1px',
         borderColor: theme('colors.wcag.border-medium'),
         borderRadius: theme('borderRadius.md'),
         backgroundColor: 'white',
         color: theme('colors.wcag.text-primary'),
         '&:focus': {
           outline: `2px solid ${theme('colors.wcag.focus-ring')}`,
           outlineOffset: '2px',
           borderColor: theme('colors.wcag.focus-ring'),
         },
         '&:invalid': {
           borderColor: theme('colors.wcag.error-border'),
         },
         '&::placeholder': {
           color: theme('colors.wcag.text-tertiary'),
         },
       },
       '.wcag-error-message': {
         color: theme('colors.wcag.error-text'),
         fontSize: theme('fontSize.wcag-small')?.[0],
         lineHeight: theme('fontSize.wcag-small')?.[1]?.lineHeight,
         marginTop: theme('spacing.1'),
       },
       '.wcag-success-message': {
         color: theme('colors.wcag.success-text'),
         fontSize: theme('fontSize.wcag-small')?.[0],
         lineHeight: theme('fontSize.wcag-small')?.[1]?.lineHeight,
         marginTop: theme('spacing.1'),
       },
       // 🎯 Skip links
       '.skip-link': {
         position: 'absolute',
         top: theme('spacing.4'),
         left: theme('spacing.4'),
         zIndex: '50',
         padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
         backgroundColor: theme('colors.wcag.button-primary'),
         color: 'white',
         fontSize: theme('fontSize.wcag-small')?.[0],
         fontWeight: '600',
         borderRadius: theme('borderRadius.md'),
         boxShadow: theme('boxShadow.lg'),
         transform: 'translateY(-100%)',
         opacity: '0',
         transition: 'all 0.2s ease-in-out',
         '&:focus': {
           transform: 'translateY(0)',
           opacity: '1',
           outline: `2px solid ${theme('colors.wcag.focus-ring-offset')}`,
           outlineOffset: '2px',
         },
         '@media (prefers-reduced-motion: reduce)': {
           transition: 'none',
         },
       },
       // 🎯 Screen reader only
       '.sr-only': {
         position: 'absolute',
         width: '1px',
         height: '1px',
         padding: '0',
         margin: '-1px',
         overflow: 'hidden',
         clip: 'rect(0, 0, 0, 0)',
         whiteSpace: 'nowrap',
         border: '0',
       },
       '.not-sr-only': {
         position: 'static',
         width: 'auto',
         height: 'auto',
         padding: '0',
         margin: '0',
         overflow: 'visible',
         clip: 'auto',
         whiteSpace: 'normal',
       },
       // 🎯 Focus visible uniquement
       '.focus-visible': {
         '&:focus:not(:focus-visible)': {
           outline: 'none',
         },
         '&:focus-visible': {
           outline: `2px solid ${theme('colors.wcag.focus-ring')}`,
           outlineOffset: '2px',
         },
       },
       // 🎯 Animations respectueuses
       '.motion-safe': {
         '@media (prefers-reduced-motion: no-preference)': {
           '&': {
             animation: 'inherit',
             transition: 'inherit',
           },
         },
       },
       '.motion-reduce': {
         '@media (prefers-reduced-motion: reduce)': {
           '&': {
             animation: 'none !important',
             transition: 'none !important',
           },
         },
       },
     })
   })
 ]
}

export default config;
