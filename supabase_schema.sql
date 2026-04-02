-- The Antique Shop: Database Schema

-- Table for storing quiz results
CREATE TABLE public.quiz_results (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name text NOT NULL,
    archetype_result text NOT NULL,
    scores_json jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: In a real environment, you might want row level security (RLS) policies 
-- to allow anonymous inserts but restrict reads.
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts to quiz_results" 
ON public.quiz_results FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow public reads of quiz_results" 
ON public.quiz_results FOR SELECT 
TO public 
USING (true);

-- Table for tracking global archetype statistics (Optional optimization, 
-- but we can also just COUNT(*) on quiz_results grouped by archetype)
CREATE TABLE public.global_stats (
    archetype text PRIMARY KEY,
    count integer DEFAULT 0 NOT NULL
);

ALTER TABLE public.global_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public reads of global_stats" 
ON public.global_stats FOR SELECT 
TO public 
USING (true);

-- Function to increment archetype count on new quiz result
CREATE OR REPLACE FUNCTION increment_archetype_count()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.global_stats (archetype, count)
    VALUES (NEW.archetype_result, 1)
    ON CONFLICT (archetype) DO UPDATE
    SET count = global_stats.count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_quiz_result_insert
AFTER INSERT ON public.quiz_results
FOR EACH ROW
EXECUTE FUNCTION increment_archetype_count();
