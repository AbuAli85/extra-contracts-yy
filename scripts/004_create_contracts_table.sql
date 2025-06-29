CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contract_name TEXT NOT NULL,
    contract_type TEXT NOT NULL,
    party_a_id UUID REFERENCES parties(id) ON DELETE RESTRICT,
    party_b_id UUID REFERENCES parties(id) ON DELETE RESTRICT,
    promoter_id UUID REFERENCES promoters(id) ON DELETE RESTRICT,
    start_date DATE,
    end_date DATE,
    contract_value NUMERIC(18, 2),
    content_english TEXT NOT NULL,
    content_spanish TEXT NOT NULL,
    status TEXT DEFAULT 'Draft' NOT NULL,
    google_doc_url TEXT,
    pdf_url TEXT,
    error_details TEXT
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contracts."
ON contracts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contracts."
ON contracts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contracts."
ON contracts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contracts."
ON contracts FOR DELETE
USING (auth.uid() = user_id);
