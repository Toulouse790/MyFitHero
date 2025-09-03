// Types pour le localStorage
export interface StorageItem<T> {
  value: T;
  timestamp: number;
  expiry?: number; // En millisecondes
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
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:
