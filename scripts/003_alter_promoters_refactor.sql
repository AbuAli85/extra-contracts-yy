-- Add 'profile_picture_url' column to 'promoters' table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='promoters' AND column_name='profile_picture_url') THEN
        ALTER TABLE promoters ADD COLUMN profile_picture_url TEXT;
    END IF;
END
$$;

-- Add 'website' column to 'promoters' table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='promoters' AND column_name='website') THEN
        ALTER TABLE promoters ADD COLUMN website TEXT;
    END IF;
END
$$;

-- Add 'bio' column to 'promoters' table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='promoters' AND column_name='bio') THEN
        ALTER TABLE promoters ADD COLUMN bio TEXT;
    END IF;
END
$$;

-- Add 'city', 'state', 'zip_code', 'country' columns to 'promoters' table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='promoters' AND column_name='city') THEN
        ALTER TABLE promoters ADD COLUMN city TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='promoters' AND column_name='state') THEN
        ALTER TABLE promoters ADD COLUMN state TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='promoters' AND column_name='zip_code') THEN
        ALTER TABLE promoters ADD COLUMN zip_code TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='promoters' AND column_name='country') THEN
        ALTER TABLE promoters ADD COLUMN country TEXT;
    END IF;
END
$$;

-- Update RLS policies for 'promoters' table if necessary
-- This assumes your RLS policies might need to be adjusted for new columns.
-- If your existing policies are generic (e.g., based on user_id), you might not need to change them.
-- Example:
-- ALTER POLICY "Enable read access for all users" ON promoters
-- FOR SELECT USING (TRUE);

-- ALTER POLICY "Enable insert for authenticated users only" ON promoters
-- FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ALTER POLICY "Enable update for users based on user_id" ON promoters
-- FOR UPDATE USING (auth.uid() = id); -- Assuming promoter ID is linked to user ID for ownership

-- ALTER POLICY "Enable delete for users based on user_id" ON promoters
-- FOR DELETE USING (auth.uid() = id); -- Assuming promoter ID is linked to user ID for ownership
