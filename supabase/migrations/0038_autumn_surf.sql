-- Update existing invite codes
UPDATE public.invite_codes
SET code = 
  CASE 
    WHEN code = 'ELITE2024' THEN 'GB2025'
    WHEN code = 'WOMEN2024' THEN 'GBW2025'
    WHEN code = 'EMERGE2024' THEN 'EMERGE2025'
  END
WHERE code IN ('ELITE2024', 'WOMEN2024', 'EMERGE2024');