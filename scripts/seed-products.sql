-- Insert sample products
INSERT INTO products (name, brand, category, price, rating, review_count, description, image_url) VALUES
('Gentle Foaming Cleanser', 'CeraVe', 'Cleanser', 12.99, 4.5, 2847, 'Gentle foaming cleanser with ceramides and hyaluronic acid', '/placeholder.svg?height=200&width=200'),
('Niacinamide 10% + Zinc 1%', 'The Ordinary', 'Serum', 7.20, 4.3, 5632, 'High-strength vitamin and mineral blemish formula', '/placeholder.svg?height=200&width=200'),
('Daily Facial Moisturizer SPF 30', 'Neutrogena', 'Moisturizer', 13.47, 4.4, 1923, 'Oil-free moisturizer with broad spectrum SPF 30', '/placeholder.svg?height=200&width=200'),
('Salicylic Acid 2% Solution', 'The Ordinary', 'Treatment', 8.10, 4.2, 3456, 'Direct acid exfoliant for blemish-prone skin', '/placeholder.svg?height=200&width=200'),
('Hyaluronic Acid 2% + B5', 'The Ordinary', 'Serum', 9.90, 4.6, 4521, 'Multi-depth hydration serum', '/placeholder.svg?height=200&width=200'),
('Retinol 0.5% in Squalane', 'The Ordinary', 'Treatment', 10.90, 4.1, 2134, 'Intermediate strength retinol serum', '/placeholder.svg?height=200&width=200');

-- Get product IDs for relationships
DO $$
DECLARE
    cerave_cleanser_id UUID;
    niacinamide_id UUID;
    neutrogena_moisturizer_id UUID;
    salicylic_acid_id UUID;
    hyaluronic_acid_id UUID;
    retinol_id UUID;
BEGIN
    -- Get product IDs
    SELECT id INTO cerave_cleanser_id FROM products WHERE name = 'Gentle Foaming Cleanser';
    SELECT id INTO niacinamide_id FROM products WHERE name = 'Niacinamide 10% + Zinc 1%';
    SELECT id INTO neutrogena_moisturizer_id FROM products WHERE name = 'Daily Facial Moisturizer SPF 30';
    SELECT id INTO salicylic_acid_id FROM products WHERE name = 'Salicylic Acid 2% Solution';
    SELECT id INTO hyaluronic_acid_id FROM products WHERE name = 'Hyaluronic Acid 2% + B5';
    SELECT id INTO retinol_id FROM products WHERE name = 'Retinol 0.5% in Squalane';

    -- Insert skin types for products
    INSERT INTO product_skin_types (product_id, skin_type) VALUES
    (cerave_cleanser_id, 'Oily'),
    (cerave_cleanser_id, 'Combination'),
    (cerave_cleanser_id, 'Normal'),
    (niacinamide_id, 'Oily'),
    (niacinamide_id, 'Combination'),
    (neutrogena_moisturizer_id, 'All Types'),
    (salicylic_acid_id, 'Oily'),
    (salicylic_acid_id, 'Combination'),
    (hyaluronic_acid_id, 'All Types'),
    (retinol_id, 'Normal'),
    (retinol_id, 'Dry');

    -- Insert concerns for products
    INSERT INTO product_concerns (product_id, concern) VALUES
    (cerave_cleanser_id, 'Acne'),
    (cerave_cleanser_id, 'Oily Skin'),
    (niacinamide_id, 'Acne'),
    (niacinamide_id, 'Oily Skin'),
    (niacinamide_id, 'Pigmentation'),
    (neutrogena_moisturizer_id, 'Sun Protection'),
    (neutrogena_moisturizer_id, 'Hydration'),
    (salicylic_acid_id, 'Acne'),
    (salicylic_acid_id, 'Blackheads'),
    (hyaluronic_acid_id, 'Hydration'),
    (hyaluronic_acid_id, 'Fine Lines'),
    (retinol_id, 'Fine Lines'),
    (retinol_id, 'Pigmentation');

    -- Insert ingredients for products
    INSERT INTO product_ingredients (product_id, ingredient_name) VALUES
    (cerave_cleanser_id, 'Ceramides'),
    (cerave_cleanser_id, 'Hyaluronic Acid'),
    (cerave_cleanser_id, 'Niacinamide'),
    (niacinamide_id, 'Niacinamide'),
    (niacinamide_id, 'Zinc PCA'),
    (neutrogena_moisturizer_id, 'Avobenzone'),
    (neutrogena_moisturizer_id, 'Octinoxate'),
    (neutrogena_moisturizer_id, 'Glycerin'),
    (salicylic_acid_id, 'Salicylic Acid'),
    (salicylic_acid_id, 'Witch Hazel'),
    (hyaluronic_acid_id, 'Hyaluronic Acid'),
    (hyaluronic_acid_id, 'Vitamin B5'),
    (retinol_id, 'Retinol'),
    (retinol_id, 'Squalane');
END $$;
