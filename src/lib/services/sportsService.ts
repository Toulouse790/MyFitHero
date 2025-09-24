// client/src/services/sportsService.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useToast } from '@/shared/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { supabase } from '@/lib/supabase';

/* ------------------------------------------------------------------ */
/*                            TYPES                                   */
/* ------------------------------------------------------------------ */

export interface SportOption {
  id: string;
  name: string;
  emoji?: string;
  icon?: string;
  category?: string;
  description?: string;
  positions?: string[];
  isPopular?: boolean;
  userCount?: number;
}

export interface SportRow {
  id: string;
  name: string;
  emoji: string | undefined;
  icon: string | undefined;
  category: string | undefined;
  positions: string[] | undefined;
  is_popular: boolean | undefined;
  user_count: number | undefined;
  updated_at: string;
}

export interface SportSuggestionPayload {
  sport_name: string;
  suggested_position?: string;
  locale?: string;
  user_id?: string;
}

/* ------------------------------------------------------------------ */
/*                       CONSTANTES / CACHE                           */
/* ------------------------------------------------------------------ */

const CACHE_TTL = 5 * 60_000; // 5 min
const MEMO_KEY = 'sports-cache-v1';

/* mémoire : { data, expiry } */
let memoryCache: { data: SportRow[]; expiry: number } | undefined = null;

/* ------------------------------------------------------------------ */
/*                       FONCTIONS BAS NIVEAU                         */
/* ------------------------------------------------------------------ */

/** Lecture (et mise en cache) de la table `sports_library` */
async function fetchAllSports(): Promise<SportRow[]> {
  // 1. Cache mémoire
  if (memoryCache && memoryCache.expiry > Date.now()) {
    return memoryCache.data;
  }

  // 2. Cache sessionStorage (pour F5)
  const cached = sessionStorage.getItem(MEMO_KEY);
  if (cached) {
    const parsed = JSON.parse(cached) as { data: SportRow[]; expiry: number };
    if (parsed.expiry > Date.now()) {
      memoryCache = parsed;
      return parsed.data;
    }
  }

  // 3. Requête Supabase
  const { data, error }: any = await supabase
    .from('sports_library')
    .select('id, name, emoji, icon, category, positions, is_popular, user_count, updated_at')
    .order('name', { ascending: true });

  if (error) {
    console.error('[sportService] fetchAllSports:', error);
    throw error;
  }

  // 4. Cache
  const payload = { data, expiry: Date.now() + CACHE_TTL };
  memoryCache = payload;
  sessionStorage.setItem(MEMO_KEY, JSON.stringify(payload));

  return data as SportRow[];
}

/** Conversion SQL → SportOption (côté UI) */
function mapRow(row: SportRow | Partial<SportRow>): SportOption {
  return {
    id: row.id || '',
    name: row.name || '',
    emoji: row.emoji || '🏃‍♂️',
    icon: row.icon || undefined,
    category: row.category || undefined,
    positions: row.positions || [],
    isPopular: (row as SportRow).is_popular || false,
    userCount: (row as SportRow).user_count || 0,
  };
}

/* ------------------------------------------------------------------ */
/*                MÉTHODES PUBLIQUES – ACCÈS/SEARCH                    */
/* ------------------------------------------------------------------ */

export const SportsService = {
  /** Tous les sports (avec cache)  */
  async getSports(): Promise<SportOption[]> {
    const rows = await fetchAllSports();
    return rows.map(mapRow);
  },

  /** Sports populaires */
  async getPopularSports(limit = 12): Promise<SportOption[]> {
    const rows = await fetchAllSports();
    return rows
      .filter((r: any) => r.is_popular)
      .slice(0, limit)
      .map(mapRow);
  },

  /** Recherche full-text ; retourne max 15 résultats */
  async searchSports(query: string): Promise<SportOption[]> {
    if (!query || query.length < 2) return [];

    // Recherche locale d’abord (perfs)
    const localRows = (await fetchAllSports()).filter((r: any) =>
      r.name.toLowerCase().includes(query.toLowerCase())
    );

    if (localRows.length > 0) return localRows.map(mapRow);

        // Recherche SQL ILIKE
    const { data, error }: any = await supabase
      .from('sports_library')
      .select('id, name, emoji, icon, category, positions')
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(15);

    if (error) {
      console.error('[sportService] searchSports:', error);
      return [];
    }
    return (data ?? []).map(mapRow);
  },

  /** Détails d'un sport */
  async getSportById(id: string): Promise<SportOption | null> {
    const { data, error }: any = await supabase
      .from('sports_library')
      .select('id, name, emoji, icon, category, positions')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('[sportService] getSportById:', error);
      return null;
    }
    return mapRow(data as SportRow);
  },

  /** Suggestion utilisateur → table `sport_suggestions` */
  async suggestSport(
    sportName: string,
    opts: { suggested_position?: string; locale?: string } = {}
  ): Promise<boolean> {
    const { data: userData } = await supabase.auth.getUser();
    const payload: SportSuggestionPayload = {
      sport_name: sportName,
      description: sport.name + " sport",
      suggested_position: opts.suggested_position,
      locale: opts.locale ?? 'fr',
      user_id: userData?.user?.id ?? undefined,
    };

    const { error } = await supabase.from('sport_suggestions').insert(payload);

    if (error) {
      console.error('[sportService] suggestSport:', error);
      return false;
    }
    return true;
  },

  /** Invalidation totale du cache */
  clearCache() {
    memoryCache = null;
    sessionStorage.removeItem(MEMO_KEY);
  },
};

/* ------------------------------------------------------------------ */
/*                       HOOKS REACT (React Query)                     */
/* ------------------------------------------------------------------ */

export function useSports(options?: { enabled?: boolean }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['sports', 'all'],
    queryFn: () => SportsService.getSports(),
    staleTime: CACHE_TTL,
    gcTime: CACHE_TTL * 2,
    enabled: options?.enabled ?? true,
  });

  const { data: sports = [], isLoading, error } = query;

  if (error) {
    console.error(error);
    toast({
      title: 'Erreur',
      description: 'Impossible de charger la liste des sports',
      variant: 'destructive',
    });
  }

  return {
    sports,
    loading: isLoading,
    error: error ? 'Erreur de chargement' : null,
    refreshSports: () => {
      SportsService.clearCache();
      queryClient.invalidateQueries({ queryKey: ['sports', 'all'] });
    },
  };
}

/* ------------------------------------------------------------------ */
/*          HOOK LÉGER Fallback (si React Query n’est pas utilisé)     */
/* ------------------------------------------------------------------ */

export function useSportsFallback() {
  const { toast } = useToast();
  const [state, setState] = React.useState<{
    sports: SportOption[];
    loading: boolean;
    error: string | undefined;
  }>({
    sports: [],
    loading: true,
    error: null,
  });

  React.useEffect(() => {
    SportsService.getSports()
      .then(s => setState({ sports: s, loading: false, error: null }))
      .catch(e => {
        console.error(e);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les sports',
          variant: 'destructive',
        });
        setState({
          sports: [],
          loading: false,
          error: 'Erreur de chargement',
        });
      });
  }, [toast]);

  return { ...state, refreshSports: SportsService.clearCache };
}
