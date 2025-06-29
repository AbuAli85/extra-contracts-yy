-- Update RLS policies for the 'promoters' table
-- First, drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own promoters." ON promoters;
DROP POLICY IF EXISTS "Users can insert their own promoters." ON promoters;
DROP POLICY IF EXISTS "Users can update their own promoters." ON promoters;
DROP POLICY IF EXISTS "Users can delete their own promoters." ON promoters;

-- Re-create policies, ensuring they refer to the correct columns (e.g., user_id)
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

-- Update RLS policies for the 'parties' table
-- First, drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own parties." ON parties;
DROP POLICY IF EXISTS "Users can insert their own parties." ON parties;
DROP POLICY IF EXISTS "Users can update their own parties." ON parties;
DROP POLICY IF EXISTS "Users can delete their own parties." ON parties;

-- Re-create policies
CREATE POLICY "Users can view their own parties."
ON parties FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own parties."
ON parties FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own parties."
ON parties FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own parties."
ON parties FOR DELETE
USING (auth.uid() = user_id);

-- Update RLS policies for the 'contracts' table
-- First, drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own contracts." ON contracts;
DROP POLICY IF EXISTS "Users can insert their own contracts." ON contracts;
DROP POLICY IF EXISTS "Users can update their own contracts." ON contracts;
DROP POLICY IF EXISTS "Users can delete their own contracts." ON contracts;

-- Re-create policies
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

-- Optional: Add RLS for audit_logs and notifications if they are user-specific
-- Assuming 'audit_logs' and 'notifications' tables have a 'user_id' column

-- For audit_logs
DROP POLICY IF EXISTS "Users can view their own audit logs." ON audit_logs;
CREATE POLICY "Users can view their own audit logs."
ON audit_logs FOR SELECT
USING (auth.uid() = user_id);

-- For notifications
DROP POLICY IF EXISTS "Users can view their own notifications." ON notifications;
CREATE POLICY "Users can view their own notifications."
ON notifications FOR SELECT
USING (auth.uid() = user_id);
