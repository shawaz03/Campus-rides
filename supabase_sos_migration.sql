-- 1. CREATE SOS ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.sos_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status VARCHAR(20) DEFAULT 'active', -- 'active' or 'resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 2. ENABLE ROW LEVEL SECURITY ON SOS ALERTS
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;

-- 3. CREATE RLS POLICIES FOR SOS ALERTS
DROP POLICY IF EXISTS "Allow students to insert their own SOS alerts" ON public.sos_alerts;
CREATE POLICY "Allow students to insert their own SOS alerts" ON public.sos_alerts
  FOR INSERT WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Allow students to view their own SOS alerts" ON public.sos_alerts;
CREATE POLICY "Allow students to view their own SOS alerts" ON public.sos_alerts
  FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Allow authenticated to read all SOS alerts" ON public.sos_alerts;
CREATE POLICY "Allow authenticated to read all SOS alerts" ON public.sos_alerts
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated to update SOS alerts" ON public.sos_alerts;
CREATE POLICY "Allow authenticated to update SOS alerts" ON public.sos_alerts
  FOR UPDATE TO authenticated USING (true);

-- 4. ADD IS_EMERGENCY FLAG TO RIDES TABLE
ALTER TABLE public.rides ADD COLUMN IF NOT EXISTS is_emergency BOOLEAN DEFAULT FALSE;
