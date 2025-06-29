-- Add 'type' column to 'parties' table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parties' AND column_name='type') THEN
        ALTER TABLE parties ADD COLUMN type TEXT NOT NULL DEFAULT 'Individual';
        -- You might want to update existing rows to a default value if needed
        -- UPDATE parties SET type = 'Individual' WHERE type IS NULL;
    END IF;
END
$$;

-- Create a new type for party_type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'party_type') THEN
        CREATE TYPE party_type AS ENUM ('Individual', 'Company');
    END IF;
END
$$;

-- Alter column to use the new ENUM type, if it's not already
-- This step might require dropping and re-adding the column if there's existing data
-- or if the column type is incompatible. Proceed with caution in production.
-- For simplicity, assuming it's a new column or can be cast.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parties' AND column_name='type' AND data_type='text') THEN
        ALTER TABLE parties ALTER COLUMN type TYPE party_type USING type::party_type;
    END IF;
END
$$;

-- Update RLS policies for 'parties' table to include the new 'type' column if necessary
-- This assumes your RLS policies might need to consider the 'type' column for access control.
-- If your existing policies are generic (e.g., based on user_id), you might not need to change them.
-- Example:
-- ALTER POLICY "Enable read access for all users" ON parties
-- FOR SELECT USING (TRUE);

-- ALTER POLICY "Enable insert for authenticated users only" ON parties
-- FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ALTER POLICY "Enable update for users based on user_id" ON parties
-- FOR UPDATE USING (auth.uid() = user_id); -- Assuming a user_id column exists

-- ALTER POLICY "Enable delete for users based on user_id" ON parties
-- FOR DELETE USING (auth.uid() = user_id); -- Assuming a user_id column exists
