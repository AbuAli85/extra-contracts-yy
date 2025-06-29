CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contract_id TEXT UNIQUE NOT NULL,
  contract_name TEXT NOT NULL,
  contract_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  effective_date DATE,
  termination_date DATE,
  party_a_id UUID REFERENCES parties(id) ON DELETE SET NULL,
  party_b_id UUID REFERENCES parties(id) ON DELETE SET NULL,
  promoter_id UUID REFERENCES promoters(id) ON DELETE SET NULL,
  contract_value NUMERIC(15, 2),
  payment_terms TEXT,
  content_english TEXT,
  content_spanish TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contracts." ON contracts
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own contracts." ON contracts
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own contracts." ON contracts
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own contracts." ON contracts
  FOR DELETE USING (auth.uid() = created_by);

-- Optional: Add an index for faster lookups on contract_id
CREATE INDEX IF NOT EXISTS idx_contracts_contract_id ON contracts (contract_id);

-- Optional: Add an index for faster lookups on created_by
CREATE INDEX IF NOT EXISTS idx_contracts_created_by ON contracts (created_by);

-- Optional: Add an index for faster lookups on status
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts (status);
