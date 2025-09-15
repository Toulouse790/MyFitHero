-- Test de connexion simple pour vérifier l'accès
SELECT 
  'Test de connexion réussi' as status,
  current_timestamp as timestamp,
  current_user as user_connected;

-- Vérifier les tables workout existantes
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%workout%'
ORDER BY table_name;