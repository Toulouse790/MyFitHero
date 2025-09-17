-- Migration : Tables pour Food Scanner AI et base nutritionnelle
-- Date: 2025-09-17
-- Description: Ajout des tables food_items et nutrition_scans pour le système de reconnaissance alimentaire

-- Table des aliments avec données nutritionnelles
CREATE TABLE IF NOT EXISTS food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT,
  barcode TEXT,
  calories_per_100g INTEGER NOT NULL,
  protein_per_100g DECIMAL(5,2) NOT NULL DEFAULT 0,
  carbs_per_100g DECIMAL(5,2) NOT NULL DEFAULT 0,
  fat_per_100g DECIMAL(5,2) NOT NULL DEFAULT 0,
  fiber_per_100g DECIMAL(5,2) DEFAULT 0,
  sugar_per_100g DECIMAL(5,2) DEFAULT 0,
  sodium_per_100g DECIMAL(7,2) DEFAULT 0, -- en mg
  user_submitted BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  usda_id INTEGER, -- Référence USDA FDC ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des scans de reconnaissance alimentaire
CREATE TABLE IF NOT EXISTS nutrition_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  detected_food TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  calories INTEGER NOT NULL,
  protein DECIMAL(5,2) DEFAULT 0,
  carbs DECIMAL(5,2) DEFAULT 0,
  fat DECIMAL(5,2) DEFAULT 0,
  portion_size TEXT DEFAULT '100g',
  weight_grams INTEGER DEFAULT 100,
  food_item_id UUID REFERENCES food_items(id),
  ai_provider TEXT CHECK (ai_provider IN ('openai', 'google', 'mock')),
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_food_items_name ON food_items USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_food_items_brand ON food_items(brand);
CREATE INDEX IF NOT EXISTS idx_food_items_barcode ON food_items(barcode);
CREATE INDEX IF NOT EXISTS idx_food_items_verified ON food_items(verified);
CREATE INDEX IF NOT EXISTS idx_food_items_usda_id ON food_items(usda_id);

CREATE INDEX IF NOT EXISTS idx_nutrition_scans_user_id ON nutrition_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_scans_created_at ON nutrition_scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nutrition_scans_confidence ON nutrition_scans(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_nutrition_scans_food_item_id ON nutrition_scans(food_item_id);

-- Fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour auto-update du timestamp
CREATE TRIGGER update_food_items_updated_at
    BEFORE UPDATE ON food_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) pour sécuriser les données
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_scans ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour food_items
CREATE POLICY "Food items visible to all authenticated users" ON food_items
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert food items" ON food_items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their submitted food items" ON food_items
    FOR UPDATE USING (user_submitted = true AND auth.uid() IN (
        SELECT user_id FROM nutrition_scans WHERE food_item_id = food_items.id
    ));

-- Politiques RLS pour nutrition_scans
CREATE POLICY "Users can view their own scans" ON nutrition_scans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scans" ON nutrition_scans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scans" ON nutrition_scans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans" ON nutrition_scans
    FOR DELETE USING (auth.uid() = user_id);

-- Données d'exemple pour les tests (aliments populaires français)
INSERT INTO food_items (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, verified, usda_id) VALUES
('Pomme', 52, 0.3, 14, 0.2, true, 171688),
('Banane', 89, 1.1, 23, 0.3, true, 173944),
('Riz blanc cuit', 130, 2.7, 28, 0.3, true, 168878),
('Poulet grillé (blanc)', 165, 31, 0, 3.6, true, 171477),
('Saumon grillé', 206, 22, 0, 12, true, 175167),
('Baguette française', 274, 9, 56, 1.2, true, 172687),
('Yaourt nature', 59, 10, 4, 0.4, true, 170894),
('Œuf entier', 155, 13, 1.1, 11, true, 173424),
('Brocoli cuit', 22, 3, 4, 0.4, true, 169967),
('Avocat', 160, 2, 9, 15, true, 171706),
('Pain complet', 247, 13, 41, 4.2, true, 172365),
('Lait entier', 61, 3.2, 4.8, 3.3, true, 171256),
('Tomate', 18, 0.9, 3.9, 0.2, true, 170457),
('Carotte', 41, 0.9, 10, 0.2, true, 169998),
('Pâtes cuites', 131, 5, 25, 1.1, true, 168927)
ON CONFLICT (usda_id) DO NOTHING;

-- Vue pour les statistiques de scan par utilisateur
CREATE OR REPLACE VIEW user_scan_stats AS
SELECT 
    user_id,
    COUNT(*) as total_scans,
    AVG(confidence) as avg_confidence,
    COUNT(CASE WHEN confidence > 0.8 THEN 1 END) as high_confidence_scans,
    DATE_TRUNC('day', created_at) as scan_date,
    SUM(calories) as total_calories_scanned
FROM nutrition_scans
GROUP BY user_id, DATE_TRUNC('day', created_at);

-- Vue pour les aliments les plus scannés
CREATE OR REPLACE VIEW popular_foods AS
SELECT 
    fi.name,
    fi.brand,
    COUNT(ns.id) as scan_count,
    AVG(ns.confidence) as avg_confidence,
    fi.calories_per_100g,
    fi.verified
FROM food_items fi
JOIN nutrition_scans ns ON fi.id = ns.food_item_id
GROUP BY fi.id, fi.name, fi.brand, fi.calories_per_100g, fi.verified
ORDER BY scan_count DESC;

-- Fonction pour nettoyer les anciens scans (optionnel)
CREATE OR REPLACE FUNCTION cleanup_old_scans()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM nutrition_scans 
    WHERE created_at < NOW() - INTERVAL '1 year'
    AND confidence < 0.5;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Commentaires pour documentation
COMMENT ON TABLE food_items IS 'Base de données des aliments avec informations nutritionnelles par 100g';
COMMENT ON TABLE nutrition_scans IS 'Historique des scans de reconnaissance alimentaire par IA';
COMMENT ON COLUMN food_items.usda_id IS 'Référence vers USDA FoodData Central (FDC ID)';
COMMENT ON COLUMN nutrition_scans.confidence IS 'Score de confiance de la reconnaissance IA (0-1)';
COMMENT ON COLUMN nutrition_scans.ai_provider IS 'Fournisseur IA utilisé pour la reconnaissance';
COMMENT ON COLUMN nutrition_scans.processing_time_ms IS 'Temps de traitement de la reconnaissance en millisecondes';