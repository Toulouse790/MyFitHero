import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

// Minimal wrapper autour des primitives Radix Dialog.
// On réexporte ce dont l’application a besoin : Dialog,
// DialogTrigger, DialogContent, DialogHeader et DialogTitle.

/** Composant racine contrôlant l’état du dialog. */
export const Dialog = DialogPrimitive.Root;

/** Déclencheur qui ouvre/ferme le dialog. */
export const DialogTrigger = DialogPrimitive.Trigger;

/** Conteneur principal du contenu du dialog. */
export const DialogContent = DialogPrimitive.Content;

/** En-tête de dialog, simple wrapper <div>. */
export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={className} {...props} />;

/** Titre du dialog. */
export const DialogTitle = DialogPrimitive.Title;

/** Description du dialog. */
export const DialogDescription = DialogPrimitive.Description;

/** Pied de page du dialog, simple wrapper <div>. */
export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ''}`} {...props} />;
