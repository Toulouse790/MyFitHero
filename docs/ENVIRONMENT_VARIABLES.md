# Configuration des Variables d'Environnement

## 🔧 Variables Supabase Requises

Les variables suivantes sont **obligatoires** pour le bon fonctionnement de l'application :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase
```

## ⚠️ Validation Stricte

L'application utilise désormais une **validation stricte** :

- ❌ **L'application refuse de démarrer** si les variables sont manquantes
- ❌ **Aucun fallback** vers des valeurs factices
- ✅ **Erreur claire** indiquant la variable manquante

### Comportement Avant (Problématique)
```typescript
// ❌ Problème: client inutilisable créé silencieusement
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
);
```

### Comportement Actuel (Correct)
```typescript
// ✅ Solution: validation stricte avec erreurs bloquantes
if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
  throw new Error('❌ VITE_SUPABASE_URL est requise et doit être configurée dans le fichier .env');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## 🧪 Comment Tester

1. **Test de validation** :
   ```bash
   # Commentez temporairement les variables dans .env
   # VITE_SUPABASE_URL=...
   # VITE_SUPABASE_ANON_KEY=...
   
   npm run dev
   # L'application devrait refuser de démarrer
   ```

2. **Vérification de la configuration** :
   ```typescript
   import { validateSupabaseConfig } from '@/lib/supabase';
   
   // Affiche la configuration actuelle
   validateSupabaseConfig();
   ```

## 🛠️ Variables Supplémentaires

D'autres services utilisent également des variables d'environnement :

```env
# Nutrition APIs
VITE_FOOD_RECOGNITION_API=https://api.example.com
VITE_FOOD_RECOGNITION_API_KEY=votre_clé
VITE_NUTRITION_API=https://api.example.com
VITE_USDA_API_KEY=votre_clé_usda

# Claude AI
VITE_CLAUDE_API_KEY=votre_clé_claude
```

## ✅ Avantages de la Validation Stricte

1. **Détection précoce** des problèmes de configuration
2. **Pas de comportement silencieux** qui masque les erreurs
3. **Messages d'erreur clairs** pour le débogage
4. **Environnement de développement plus fiable**