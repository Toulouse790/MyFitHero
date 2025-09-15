# 🔍 Comment Vérifier le Déploiement Supabase

## 📱 **Interface Web Supabase**

### 1. Aller sur Table Editor
1. Connectez-vous à [supabase.com](https://supabase.com)
2. Ouvrez votre projet MyFitHero
3. Cliquez sur **"Table Editor"** dans le menu latéral
4. Vous devriez voir ces 5 nouvelles tables :
   - ✅ `workout_plans`
   - ✅ `workout_sessions` 
   - ✅ `workout_sets`
   - ✅ `session_metrics`
   - ✅ `sync_queue`

### 2. Vérifier les Structures
Cliquez sur chaque table pour voir :
- ✅ Colonnes créées correctement
- ✅ Types de données
- ✅ Contraintes et index
- ✅ Policies RLS activées

## 🛠️ **SQL Editor - Vérification**

### Script de Vérification Rapide
```sql
-- Vérifier que toutes les tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('workout_plans', 'workout_sessions', 'workout_sets', 'session_metrics', 'sync_queue');

-- Résultat attendu: 5 lignes
```

### Test d'Insertion
```sql
-- Tester l'insertion (nécessite un utilisateur auth)
INSERT INTO workout_plans (user_id, name, description, exercises, difficulty)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Test Plan',
  'Plan de test',
  '[]'::jsonb,
  'beginner'
);

-- Si ça marche = tout est OK !
```

## 🔧 **Depuis l'Application (API)**

### Test avec cURL
```bash
# Remplacez YOUR_SUPABASE_URL et YOUR_ANON_KEY
curl -X GET "YOUR_SUPABASE_URL/rest/v1/workout_plans" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Réponse attendue: JSON avec données ou []
```

## ⚠️ **Signes que ça N'A PAS marché**

### Dans Table Editor:
- ❌ Tables manquantes
- ❌ Erreur "Table does not exist"
- ❌ Colonnes manquantes

### Dans SQL Editor:
- ❌ Erreur lors de SELECT
- ❌ "relation does not exist"
- ❌ Erreurs de permissions

## 🚨 **Dépannage**

### Si les tables n'existent pas :
1. **Réexécuter le script** `setup-workout-tables.sql`
2. **Vérifier les erreurs** dans SQL Editor
3. **Checker les permissions** de votre utilisateur Supabase

### Erreurs communes :
- **Table auth.users manquante** → Activer Supabase Auth
- **Permissions insuffisantes** → Vérifier rôle admin
- **Contraintes FK** → Vérifier tables dépendantes

## ✅ **Validation Complète**

### Checklist Final :
- [ ] 5 tables visibles dans Table Editor
- [ ] Policies RLS actives sur toutes
- [ ] Test d'insertion réussi
- [ ] Index créés correctement
- [ ] Pas d'erreurs dans les logs

---

**🎯 Si tout est ✅ = Votre système workout est prêt !**