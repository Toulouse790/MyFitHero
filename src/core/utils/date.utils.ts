import { format, parseISO, isValid, addDays, subDays, differenceInDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

// Formatage des dates
export const formatDate = (date: Date | string, formatStr: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, formatStr, { locale: fr }) : '';
};

// Date relative (ex: "Il y a 2 heures")
export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';

  const now = new Date();
  const diffInDays = differenceInDays(now, dateObj);

  if (diffInDays === 0) {
    const hours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60));
      return minutes <= 1 ? 'À l\'instant' : `Il y a ${minutes} minutes`;
    }
    return hours === 1 ? 'Il y a 1 heure' : `Il y a ${hours} heures`;
  }
  
  if (diffInDays === 1) return 'Hier';
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? 'Il y a 1 semaine' : `Il y a ${weeks} semaines`;
  }

  return format(dateObj, 'dd/MM/yyyy', { locale: fr });
};

// Formatage pour l'affichage horaire
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, 'HH:mm', { locale: fr }) : '';
};

// Formatage complet date + heure
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, 'dd/MM/yyyy à HH:mm', { locale: fr }) : '';
};

// Date du jour formatée
export const getToday = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

// Calculs de périodes
export const getDateRange = (period: 'week' | 'month' | 'quarter' | 'year') => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (period) {
    case 'week':
      startDate = startOfWeek(now, { weekStartsOn: 1 }); // Lundi
      endDate = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case 'month':
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
    case 'quarter':
      const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
      startDate = new Date(now.getFullYear(), quarterMonth, 1);
      endDate = new Date(now.getFullYear(), quarterMonth + 3, 0);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;
    default:
      startDate = now;
      endDate = now;
  }

  return {
    start: format(startDate, 'yyyy-MM-dd'),
    end: format(endDate, 'yyyy-MM-dd'),
    startDate,
    endDate,
  };
};

// Âge depuis une date de naissance
export const calculateAge = (birthDate: Date | string): number => {
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  if (!isValid(birth)) return 0;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

// Durée formatée (ex: 1h 30min)
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}min`;
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

// Conversion secondes en durée lisible
export const formatSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Dates de la semaine courante
export const getCurrentWeekDays = (): Date[] => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

// Jours du mois
export const getMonthDays = (date: Date = new Date()): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days: Date[] = [];
  
  let current = start;
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }
  
  return days;
};
