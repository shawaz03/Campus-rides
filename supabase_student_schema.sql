-- 1. ALIGN STUDENTS TABLE COLUMNS
-- Adds missing columns required by the app if they do not exist.
-- Safely copies full_name to name if full_name is present but name is not.

DO $$ 
BEGIN
    -- Check if students table exists, if not create it
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'students') THEN
        CREATE TABLE public.students (
            user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            name TEXT,
            email TEXT,
            college_id TEXT,
            phone TEXT,
            coins_balance INTEGER DEFAULT 0,
            ride_streak INTEGER DEFAULT 0,
            emergency_contact TEXT,
            trusted_drivers TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        );
    ELSE
        -- Add name column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'students' AND column_name = 'name') THEN
            ALTER TABLE public.students ADD COLUMN name TEXT;
            
            -- If full_name exists, populate name from it
            IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'students' AND column_name = 'full_name') THEN
                UPDATE public.students SET name = full_name;
            END IF;
        END IF;

        -- Add coins_balance column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'students' AND column_name = 'coins_balance') THEN
            ALTER TABLE public.students ADD COLUMN coins_balance INTEGER DEFAULT 0;
        END IF;

        -- Add ride_streak column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'students' AND column_name = 'ride_streak') THEN
            ALTER TABLE public.students ADD COLUMN ride_streak INTEGER DEFAULT 0;
        END IF;

        -- Add emergency_contact column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'students' AND column_name = 'emergency_contact') THEN
            ALTER TABLE public.students ADD COLUMN emergency_contact TEXT;
        END IF;

        -- Add trusted_drivers column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'students' AND column_name = 'trusted_drivers') THEN
            ALTER TABLE public.students ADD COLUMN trusted_drivers TEXT[];
        END IF;
    END IF;
END $$;

-- 2. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 3. CREATE POLICIES FOR STUDENTS
-- Allow public select access to read students list
DROP POLICY IF EXISTS "Allow public select on students" ON public.students;
CREATE POLICY "Allow public select on students" ON public.students
    FOR SELECT USING (true);

-- Allow authenticated/anon users to insert their profile (needed for onboarding/auto-create)
DROP POLICY IF EXISTS "Allow public insert on students" ON public.students;
CREATE POLICY "Allow public insert on students" ON public.students
    FOR INSERT WITH CHECK (true);

-- Allow public update access (needed for admin updates like awarding coins/adjusting streak, or profile edits)
DROP POLICY IF EXISTS "Allow public update on students" ON public.students;
CREATE POLICY "Allow public update on students" ON public.students
    FOR UPDATE USING (true);
