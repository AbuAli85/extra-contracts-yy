<<<<<<< HEAD
CREATE TABLE party_files (
  id SERIAL PRIMARY KEY,
  party_id INTEGER REFERENCES parties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  file_name TEXT,
  file_url TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
=======
CREATE TABLE party_files (
  id SERIAL PRIMARY KEY,
  party_id INTEGER REFERENCES parties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  file_name TEXT,
  file_url TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
); 