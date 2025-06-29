CREATE TABLE promoters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    company_name TEXT NOT NULL,
    company_address TEXT,
    contact_person TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    website TEXT,
    notes TEXT,
    logo_url TEXT
);

ALTER TABLE promoters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own promoters."
ON promoters FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own promoters."
ON promoters FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own promoters."
ON promoters FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own promoters."
ON promoters FOR DELETE
USING (auth.uid() = user_id);
