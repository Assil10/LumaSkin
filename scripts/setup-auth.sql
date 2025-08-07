-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Create policies for skin_analyses table
CREATE POLICY "Users can view own analyses" ON skin_analyses
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own analyses" ON skin_analyses
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own analyses" ON skin_analyses
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Create policies for detected_conditions table
CREATE POLICY "Users can view own conditions" ON detected_conditions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM skin_analyses 
      WHERE skin_analyses.id = detected_conditions.analysis_id 
      AND auth.uid()::text = skin_analyses.user_id::text
    )
  );

CREATE POLICY "Users can insert own conditions" ON detected_conditions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM skin_analyses 
      WHERE skin_analyses.id = detected_conditions.analysis_id 
      AND auth.uid()::text = skin_analyses.user_id::text
    )
  );

-- Create policies for recommendations table
CREATE POLICY "Users can view own recommendations" ON recommendations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM skin_analyses 
      WHERE skin_analyses.id = recommendations.analysis_id 
      AND auth.uid()::text = skin_analyses.user_id::text
    )
  );

CREATE POLICY "Users can insert own recommendations" ON recommendations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM skin_analyses 
      WHERE skin_analyses.id = recommendations.analysis_id 
      AND auth.uid()::text = skin_analyses.user_id::text
    )
  );

-- Products table remains public (no RLS needed)
-- Users should be able to view all products

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
