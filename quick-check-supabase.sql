-- ============================================================================
-- SCRIPT DE VÉRIFICATION RAPIDE SUPABASE
-- Copiez-collez dans SQL Editor pour vérifier le déploiement
-- ============================================================================

-- 1. Vérifier que toutes les tables existent
SELECT 
  'Tables Workout' as verification,
  COUNT(*) as tables_trouvees,
  CASE 
    WHEN COUNT(*) = 5 THEN '✅ SUCCÈS - Toutes les tables créées'
    ELSE '❌ ÉCHEC - Tables manquantes'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('workout_plans', 'workout_sessions', 'workout_sets', 'session_metrics', 'sync_queue');

-- 2. Lister les tables trouvées
SELECT 
  table_name as table_name,
  '✅' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('workout_plans', 'workout_sessions', 'workout_sets', 'session_metrics', 'sync_queue')
ORDER BY table_name;

-- 3. Vérifier RLS (Row Level Security)
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_active,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Activé'
    ELSE '❌ RLS Désactivé'
  END as security_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('workout_plans', 'workout_sessions', 'workout_sets', 'session_metrics', 'sync_queue')
ORDER BY tablename;

-- 4. Test simple (optionnel - nécessite un utilisateur)
SELECT 
  'Test de connexion' as test,
  CASE 
    WHEN EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN '✅ Auth configuré'
    ELSE '⚠️ Pas d\'utilisateurs auth'
  END as auth_status;

-- RÉSULTAT ATTENDU:
-- - tables_trouvees = 5
-- - Toutes les tables listées avec ✅
-- - RLS activé sur toutes les tables
-- - Auth configuré (si vous avez des utilisateurs)