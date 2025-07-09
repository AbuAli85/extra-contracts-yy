<<<<<<< HEAD
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT,
  entity_type TEXT,
  entity_id INTEGER,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
=======
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT,
  entity_type TEXT,
  entity_id INTEGER,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
); 