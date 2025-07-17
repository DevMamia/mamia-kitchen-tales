-- Update Chef Kenji to Yai Malee with Thai characteristics
UPDATE public.mamas 
SET 
  name = 'Yai Malee',
  cuisine_type = 'thai',
  description = 'A warm Thai grandmother who learned her culinary secrets from generations of family recipes. She brings the authentic flavors of Thailand with love and patience.',
  voice_id = 'yai_malee_voice_id',
  accent_description = 'Gentle Thai accent with nurturing warmth',
  signature_dish = 'Green Curry with Thai Basil',
  avatar_url = '/images/mamas/yai-malee.jpg',
  color_primary = '#4A7C59',
  color_secondary = '#90EE90',
  personality_traits = ARRAY['nurturing', 'patient', 'wise', 'traditional', 'warm'],
  updated_at = NOW()
WHERE name = 'Chef Kenji';