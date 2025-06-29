CREATE TABLE IF NOT EXISTS promoters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    company TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT,
    bio TEXT,
    website TEXT,
    profile_picture_url TEXT
);

ALTER TABLE promoters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON promoters
FOR SELECT USING (TRUE);

CREATE POLICY "Enable insert for authenticated users only" ON promoters
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user_id" ON promoters
FOR UPDATE USING (auth.uid() = id); -- Assuming promoter ID is linked to user ID for ownership

CREATE POLICY "Enable delete for users based on user_id" ON promoters
FOR DELETE USING (auth.uid() = id); -- Assuming promoter ID is linked to user ID for ownership
