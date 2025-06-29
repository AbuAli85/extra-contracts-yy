CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    contract_id TEXT UNIQUE NOT NULL, -- Unique identifier for the contract
    contract_name TEXT NOT NULL,
    contract_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Draft', -- e.g., Draft, Pending Review, Approved, Active, Completed, Archived, Terminated
    party_a_id UUID REFERENCES parties(id) ON DELETE RESTRICT,
    party_b_id UUID REFERENCES parties(id) ON DELETE RESTRICT,
    promoter_id UUID REFERENCES promoters(id) ON DELETE RESTRICT,
    effective_date DATE,
    termination_date DATE,
    contract_value NUMERIC(18, 2),
    payment_terms TEXT,
    content_english TEXT NOT NULL,
    content_spanish TEXT NOT NULL,
    is_template BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contracts_contract_id ON contracts (contract_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts (status);
CREATE INDEX IF NOT EXISTS idx_contracts_party_a_id ON contracts (party_a_id);
CREATE INDEX IF NOT EXISTS idx_contracts_party_b_id ON contracts (party_b_id);
CREATE INDEX IF NOT EXISTS idx_contracts_promoter_id ON contracts (promoter_id);
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON contracts (user_id);

--
