-- Supabase RLS Policies for Admin Dashboard Read Access
-- Execute these in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Allow public select access on the 'drivers' table
DROP POLICY IF EXISTS "Allow public select on drivers" ON public.drivers;
CREATE POLICY "Allow public select on drivers" ON public.drivers
    FOR SELECT USING (true);

-- 2. Allow public select access on the 'students' table
DROP POLICY IF EXISTS "Allow public select on students" ON public.students;
CREATE POLICY "Allow public select on students" ON public.students
    FOR SELECT USING (true);

-- 3. Allow public select access on the 'driver_vehicles' table
DROP POLICY IF EXISTS "Allow public select on driver_vehicles" ON public.driver_vehicles;
CREATE POLICY "Allow public select on driver_vehicles" ON public.driver_vehicles
    FOR SELECT USING (true);

-- 4. Allow public select access on the 'driver_documents' table
DROP POLICY IF EXISTS "Allow public select on driver_documents" ON public.driver_documents;
CREATE POLICY "Allow public select on driver_documents" ON public.driver_documents
    FOR SELECT USING (true);

-- 5. Allow public select access on the 'driver_payouts' table
DROP POLICY IF EXISTS "Allow public select on driver_payouts" ON public.driver_payouts;
CREATE POLICY "Allow public select on driver_payouts" ON public.driver_payouts
    FOR SELECT USING (true);
