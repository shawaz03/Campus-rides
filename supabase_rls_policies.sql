-- Supabase Row-Level Security (RLS) Policies for Campus Rides
-- Run these queries in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Allow authenticated drivers to view new requested rides that are unassigned
CREATE POLICY "Allow drivers to view pending requests" ON rides
    FOR SELECT
    TO authenticated
    USING (status = 'requested' AND driver_id IS NULL);

-- 2. Allow authenticated drivers to accept an unassigned requested ride
CREATE POLICY "Allow drivers to accept requests" ON rides
    FOR UPDATE
    TO authenticated
    USING (status = 'requested' AND driver_id IS NULL)
    WITH CHECK (driver_id = auth.uid() AND status = 'active');
