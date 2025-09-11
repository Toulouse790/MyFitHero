import { supabase } from './supabase.client';

// Types pour les intercepteurs
export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  data: T | null;
  error: Error | null;
  status: number;
}

// Intercepteur principal pour les requêtes API
export class ApiInterceptor {
  private static baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

  // Ajouter les headers d'authentification
  private static async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      return {
        'Authorization': `Bearer ${session.access_token}`,
      };
    }
    
    return {};
  }

  // Construire l'URL complète
  private static buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseURL}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      return `${url}?${searchParams.toString()}`;
    }

    return url;
  }

  // Logger pour le développement
  private static log(message: string, data?: any): void {
    if (import.meta.env.DEV) {
      console.log(`[API] ${message}`, data || '');
    }
  }

  // Gestion des erreurs
  private static handleError(error: any): Error {
    if (error.response) {
      // Erreur de réponse du serveur
      return new Error(error.response.data?.message || error.response.statusText);
    } else if (error.request) {
      // Pas de réponse du serveur
      return new Error('Aucune réponse du serveur');
    } else {
      // Erreur de configuration
      return new Error(error.message || 'Erreur inconnue');
    }
  }

  // Méthode principale de requête
  static async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      this.log('Request', config);

      const authHeaders = await this.getAuthHeaders();
      const url = this.buildUrl(config.url, config.params);

      const response = await fetch(url, {
        method: config.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...config.headers,
        },
        body: config.body ? JSON.stringify(config.body) : undefined,
      });

      const data = await response.json();

      this.log('Response', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || response.statusText);
      }

      return {
        data,
        error: null,
        status: response.status,
      };
    } catch (error: any) {
      this.log('Error', error);
      
      return {
        data: null,
        error: this.handleError(error),
        status: error.response?.status || 500,
      };
    }
  }

  // Méthodes raccourcies
  static get<T = any>(url: string, params?: Record<string, any>) {
    return this.request<T>({ url, method: 'GET', params });
  }

  static post<T = any>(url: string, body?: any, params?: Record<string, any>) {
    return this.request<T>({ url, method: 'POST', body, params });
  }

  static put<T = any>(url: string, body?: any, params?: Record<string, any>) {
    return this.request<T>({ url, method: 'PUT', body, params });
  }

  static delete<T = any>(url: string, params?: Record<string, any>) {
    return this.request<T>({ url, method: 'DELETE', params });
  }

  static patch<T = any>(url: string, body?: any, params?: Record<string, any>) {
    return this.request<T>({ url, method: 'PATCH', body, params });
  }
}

export default ApiInterceptor;