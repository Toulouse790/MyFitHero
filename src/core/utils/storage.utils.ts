// Types pour le localStorage
export interface StorageItem<T> {
  value: T;
  timestamp: number;
  expiry: number | undefined; // En millisecondes, peut être undefined
}

// Classe pour gérer le localStorage avec expiration et typage
export class Storage {
  private static prefix = 'myfithero_';

  // Sauvegarder une donnée
  static set<T>(key: string, value: T, expiryInMinutes?: number): void {
    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        expiry: expiryInMinutes ? expiryInMinutes * 60 * 1000 : undefined,
      };
      
      localStorage.setItem(
        `${this.prefix}${key}`,
        JSON.stringify(item)
      );
    } catch (error: any) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    }
  }

  // Récupérer une donnée
  static get<T>(key: string): T | undefined {
    try {
      const storedData = localStorage.getItem(`${this.prefix}${key}`);
      if (!storedData) return null;

      const item: StorageItem<T> = JSON.parse(storedData);
      
      // Vérifier l'expiration
      if (item.expiry && Date.now() - item.timestamp > item.expiry) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error: any) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return null;
    }
  }

  // Supprimer une donnée
  static remove(key: string): void {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
    } catch (error: any) {
      console.error(`Erreur lors de la suppression de ${key}:`, error);
    }
  }

  // Vider tout le storage de l'app
  static clear(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.prefix)
      );
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error: any) {
      console.error('Erreur lors du vidage du storage:', error);
    }
  }

  // Vérifier si une clé existe
  static has(key: string): boolean {
    return localStorage.getItem(`${this.prefix}${key}`) !== null;
  }
}
