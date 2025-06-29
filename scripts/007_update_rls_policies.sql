-- Enable RLS on tables
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promoters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY; -- Assuming a custom users table

-- Policies for contracts table
DROP POLICY IF EXISTS "Users can view their own contracts." ON public.contracts;
CREATE POLICY "Users can view their own contracts." ON public.contracts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own contracts." ON public.contracts;
CREATE POLICY "Users can insert their own contracts." ON public.contracts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own contracts." ON public.contracts;
CREATE POLICY "Users can update their own contracts." ON public.contracts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own contracts." ON public.contracts;
CREATE POLICY "Users can delete their own contracts." ON public.contracts
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for parties table
DROP POLICY IF EXISTS "Users can view their own parties." ON public.parties;
CREATE POLICY "Users can view their own parties." ON public.parties
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own parties." ON public.parties;
CREATE POLICY "Users can insert their own parties." ON public.parties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own parties." ON public.parties;
CREATE POLICY "Users can update their own parties." ON public.parties
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own parties." ON public.parties;
CREATE POLICY "Users can delete their own parties." ON public.parties
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for promoters table
DROP POLICY IF EXISTS "Users can view their own promoters." ON public.promoters;
CREATE POLICY "Users can view their own promoters." ON public.promoters
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own promoters." ON public.promoters;
CREATE POLICY "Users can insert their own promoters." ON public.promoters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own promoters." ON public.promoters;
CREATE POLICY "Users can update their own promoters." ON public.promoters
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own promoters." ON public.promoters;
CREATE POLICY "Users can delete their own promoters." ON public.promoters
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for audit_logs table (assuming user_id column)
DROP POLICY IF EXISTS "Users can view their own audit logs." ON public.audit_logs;
CREATE POLICY "Users can view their own audit logs." ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Policies for notifications table (assuming user_id column)
DROP POLICY IF EXISTS "Users can view their own notifications." ON public.notifications;
CREATE POLICY "Users can view their own notifications." ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Policies for users table (assuming user_id is the primary key and matches auth.uid())
-- This policy allows users to view their own profile.
DROP POLICY IF EXISTS "Users can view their own user profile." ON public.users;
CREATE POLICY "Users can view their own user profile." ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Optional: Policy for admin users to view all data (if an 'admin' role exists)
-- This requires a 'role' column in the 'users' table and a function to check roles.
-- Example:
-- DROP POLICY IF EXISTS "Admins can view all contracts." ON public.contracts;
-- CREATE POLICY "Admins can view all contracts." ON public.contracts
--   FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
