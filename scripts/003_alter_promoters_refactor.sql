-- Add new columns for English and Arabic names
ALTER TABLE promoters ADD COLUMN name_en TEXT;
ALTER TABLE promoters ADD COLUMN name_ar TEXT;

-- Add new columns for ID card and passport details
ALTER TABLE promoters ADD COLUMN id_card_number TEXT;
ALTER TABLE promoters ADD COLUMN id_card_expiry_date DATE;
ALTER TABLE promoters ADD COLUMN id_card_url TEXT;
ALTER TABLE promoters ADD COLUMN passport_number TEXT;
ALTER TABLE promoters ADD COLUMN passport_expiry_date DATE;
ALTER TABLE promoters ADD COLUMN passport_url TEXT;

-- Migrate data from 'name' to 'name_en'
UPDATE promoters SET name_en = name;

-- Make name_en NOT NULL, assuming all existing records will be populated
ALTER TABLE promoters ALTER COLUMN name_en SET NOT NULL;

-- Drop the old 'name' column if it's no longer needed
ALTER TABLE promoters DROP COLUMN name;

-- Add a unique constraint to email if it's not already there
ALTER TABLE promoters ADD CONSTRAINT promoters_email_key UNIQUE (email);

-- Update RLS policies to reflect the new 'name_en' column if necessary
-- (This part depends on how your RLS policies are written.
-- If they refer to 'name', you'll need to update them to 'name_en' or 'name_ar' as appropriate.)

-- Example of updating RLS policies (adjust as per your actual policies)
-- You might need to drop and re-create policies if they directly reference the old 'name' column.

-- Revoke existing policies (if they exist and reference 'name')
-- DROP POLICY IF EXISTS "Users can view their own promoters." ON promoters;
-- DROP POLICY IF EXISTS "Users can insert their own promoters." ON promoters;
-- DROP POLICY IF EXISTS "Users can update their own promoters." ON promoters;
-- DROP POLICY IF EXISTS "Users can delete their own promoters." ON promoters;

-- Re-create policies with new column (example, adjust to your needs)
-- CREATE POLICY "Users can view their own promoters."
-- ON promoters FOR SELECT
-- USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert their own promoters."
-- ON promoters FOR INSERT
-- WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update their own promoters."
-- ON promoters FOR UPDATE
-- USING (auth.uid() = user_id);

-- CREATE POLICY "Users can delete their own promoters."
-- ON promoters FOR DELETE
-- USING (auth.uid() = user_id);
