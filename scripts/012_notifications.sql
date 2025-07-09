<<<<<<< HEAD
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
=======
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
); 