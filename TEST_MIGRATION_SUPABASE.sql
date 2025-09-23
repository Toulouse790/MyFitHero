-- =============================================================================
-- SCRIPT DE TEST POUR VALIDER LA MIGRATION SUPABASE
-- =============================================================================

-- 1. TESTS DES CONTRAINTES
-- -----------------------------------------------------------------------------

-- Test 1: Vérifier que la contrainte gender fonctionne
DO $$
BEGIN
    -- Test insertion valide
    INSERT INTO user_profiles (id, username, gender) 
    VALUES (gen_random_uuid(), 'test_male', 'male');
    
    INSERT INTO user_profiles (id, username, gender) 
    VALUES (gen_random_uuid(), 'test_female', 'female');
    
    INSERT INTO user_profiles (id, username, gender) 
    VALUES (gen_random_uuid(), 'test_null', NULL);
    
    RAISE NOTICE 'Test contrainte gender: ✅ PASS - Valeurs valides acceptées';
    
    -- Nettoyer
    DELETE FROM user_profiles WHERE username LIKE 'test_%';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Test contrainte gender: ❌ FAIL - %', SQLERRM;
END $$;

-- Test 2: Vérifier que 'other' est rejeté
DO $$
BEGIN
    INSERT INTO user_profiles (id, username, gender) 
    VALUES (gen_random_uuid(), 'test_other', 'other');
    
    RAISE NOTICE 'Test contrainte gender (other): ❌ FAIL - "other" accepté';
    DELETE FROM user_profiles WHERE username = 'test_other';
    
EXCEPTION
    WHEN check_violation THEN
        RAISE NOTICE 'Test contrainte gender (other): ✅ PASS - "other" correctement rejeté';
    WHEN OTHERS THEN
        RAISE NOTICE 'Test contrainte gender (other): ❌ FAIL - Erreur: %', SQLERRM;
END $$;

-- Test 3: Vérifier les statuts workout_sessions
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_session_id UUID;
BEGIN
    -- Créer un utilisateur de test
    INSERT INTO auth.users (id, email) VALUES (test_user_id, 'test@example.com');
    INSERT INTO user_profiles (id, username) VALUES (test_user_id, 'test_user');
    
    -- Test des statuts valides
    INSERT INTO workout_sessions (id, user_id, name, status) 
    VALUES (gen_random_uuid(), test_user_id, 'Test Workout 1', 'idle') RETURNING id INTO test_session_id;
    
    UPDATE workout_sessions SET status = 'active' WHERE id = test_session_id;
    UPDATE workout_sessions SET status = 'completed' WHERE id = test_session_id;
    
    RAISE NOTICE 'Test statuts workout_sessions: ✅ PASS - Statuts valides acceptés';
    
    -- Nettoyer
    DELETE FROM workout_sessions WHERE user_id = test_user_id;
    DELETE FROM user_profiles WHERE id = test_user_id;
    DELETE FROM auth.users WHERE id = test_user_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Test statuts workout_sessions: ❌ FAIL - %', SQLERRM;
END $$;

-- 2. TESTS DES VUES
-- -----------------------------------------------------------------------------

-- Test 4: Vérifier que les vues fonctionnent
DO $$
DECLARE
    view_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_count FROM exercise_details_with_history LIMIT 10;
    RAISE NOTICE 'Test vue exercise_details_with_history: ✅ PASS - % exercices trouvés', view_count;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Test vue exercise_details_with_history: ❌ FAIL - %', SQLERRM;
END $$;

DO $$
DECLARE
    view_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_count FROM workout_sessions_with_metrics LIMIT 10;
    RAISE NOTICE 'Test vue workout_sessions_with_metrics: ✅ PASS - % sessions trouvées', view_count;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Test vue workout_sessions_with_metrics: ❌ FAIL - %', SQLERRM;
END $$;

DO $$
DECLARE
    view_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_count FROM user_complete_stats LIMIT 10;
    RAISE NOTICE 'Test vue user_complete_stats: ✅ PASS - % utilisateurs trouvés', view_count;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Test vue user_complete_stats: ❌ FAIL - %', SQLERRM;
END $$;

-- 3. TESTS DES FONCTIONS
-- -----------------------------------------------------------------------------

-- Test 5: Tester les fonctions avec des données factices
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_exercise_id UUID;
    test_session_id UUID;
    record_result RECORD;
BEGIN
    -- Créer des données de test
    INSERT INTO auth.users (id, email) VALUES (test_user_id, 'test_func@example.com');
    INSERT INTO user_profiles (id, username) VALUES (test_user_id, 'test_func_user');
    
    SELECT id INTO test_exercise_id FROM exercises_library LIMIT 1;
    
    IF test_exercise_id IS NOT NULL THEN
        INSERT INTO workout_sessions (id, user_id, name, status) 
        VALUES (gen_random_uuid(), test_user_id, 'Test Function Session', 'completed') 
        RETURNING id INTO test_session_id;
        
        INSERT INTO workout_sets (id, session_id, exercise_id, user_id, set_order, exercise_order, set_number, weight, reps, is_completed)
        VALUES (gen_random_uuid(), test_session_id, test_exercise_id, test_user_id, 1, 1, 1, 80, 10, true);
        
        -- Tester la fonction get_exercise_personal_records
        SELECT * INTO record_result FROM get_exercise_personal_records(test_user_id, test_exercise_id);
        
        IF record_result.max_weight = 80 AND record_result.total_sessions = 1 THEN
            RAISE NOTICE 'Test fonction get_exercise_personal_records: ✅ PASS';
        ELSE
            RAISE NOTICE 'Test fonction get_exercise_personal_records: ❌ FAIL - Résultats incorrects';
        END IF;
        
        -- Nettoyer
        DELETE FROM workout_sets WHERE user_id = test_user_id;
        DELETE FROM workout_sessions WHERE user_id = test_user_id;
    ELSE
        RAISE NOTICE 'Test fonction get_exercise_personal_records: ⚠️ SKIP - Aucun exercice disponible';
    END IF;
    
    DELETE FROM user_profiles WHERE id = test_user_id;
    DELETE FROM auth.users WHERE id = test_user_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Test fonction get_exercise_personal_records: ❌ FAIL - %', SQLERRM;
END $$;

-- 4. TESTS DES INDEX
-- -----------------------------------------------------------------------------

-- Test 6: Vérifier que les index existent
DO $$
DECLARE
    index_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_workout_sessions_user_status'
    ) INTO index_exists;
    
    IF index_exists THEN
        RAISE NOTICE 'Test index idx_workout_sessions_user_status: ✅ PASS';
    ELSE
        RAISE NOTICE 'Test index idx_workout_sessions_user_status: ❌ FAIL - Index non trouvé';
    END IF;
END $$;

-- 5. TESTS DES POLITIQUES RLS
-- -----------------------------------------------------------------------------

-- Test 7: Vérifier que RLS est activé
DO $$
DECLARE
    rls_enabled BOOLEAN;
BEGIN
    SELECT relrowsecurity INTO rls_enabled 
    FROM pg_class 
    WHERE relname = 'workout_sessions';
    
    IF rls_enabled THEN
        RAISE NOTICE 'Test RLS workout_sessions: ✅ PASS - RLS activé';
    ELSE
        RAISE NOTICE 'Test RLS workout_sessions: ❌ FAIL - RLS non activé';
    END IF;
END $$;

-- 6. RAPPORT FINAL
-- -----------------------------------------------------------------------------

DO $$
DECLARE
    total_exercises INTEGER;
    total_views INTEGER;
    total_functions INTEGER;
    total_indexes INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_exercises FROM exercises_library;
    SELECT COUNT(*) INTO total_views FROM pg_views WHERE schemaname = 'public' 
        AND viewname IN ('exercise_details_with_history', 'workout_sessions_with_metrics', 'user_complete_stats');
    SELECT COUNT(*) INTO total_functions FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname IN ('get_exercise_personal_records', 'get_exercise_progression', 'get_popular_exercises');
    SELECT COUNT(*) INTO total_indexes FROM pg_indexes 
        WHERE tablename IN ('workout_sessions', 'workout_sets', 'exercises_library', 'session_metrics', 'daily_stats')
        AND indexname LIKE 'idx_%';
    
    RAISE NOTICE '';
    RAISE NOTICE '=== RAPPORT FINAL DES TESTS ===';
    RAISE NOTICE 'Exercices disponibles: %', total_exercises;
    RAISE NOTICE 'Vues créées: %/3', total_views;
    RAISE NOTICE 'Fonctions créées: %/3', total_functions;
    RAISE NOTICE 'Index créés: %', total_indexes;
    RAISE NOTICE '';
    
    IF total_exercises >= 3 AND total_views = 3 AND total_functions = 3 AND total_indexes >= 6 THEN
        RAISE NOTICE '🎉 MIGRATION RÉUSSIE - Tous les composants sont en place !';
    ELSE
        RAISE NOTICE '⚠️ MIGRATION PARTIELLE - Certains composants manquent';
    END IF;
    
    RAISE NOTICE '=== FIN DU RAPPORT ===';
END $$;