-- 1. ADD COORDINATE COLUMNS TO RIDES TABLE
-- These store pickup, destination, and the driver's live coordinates.
ALTER TABLE rides ADD COLUMN IF NOT EXISTS pickup_lat double precision;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS pickup_lng double precision;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS destination_lat double precision;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS destination_lng double precision;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS current_lat double precision;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS current_lng double precision;

-- 2. ENABLE ROW LEVEL SECURITY
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- 3. CREATE PUBLIC SELECT POLICY
-- To allow guardians/anonymous users to track the trip using the secret UUID.
-- If you get a duplicate policy error, you can drop the existing one or rename this.
DROP POLICY IF EXISTS "Allow public select by ride ID" ON rides;
CREATE POLICY "Allow public select by ride ID" ON rides
    FOR SELECT
    USING (true);

-- 4. CREATE UPDATE POLICY FOR DRIVERS & STUDENTS
-- Allow drivers and students to update the ride (e.g. driver updates location/status, student cancels)
DROP POLICY IF EXISTS "Allow users to update their own rides" ON rides;
CREATE POLICY "Allow users to update their own rides" ON rides
    FOR UPDATE
    TO authenticated
    USING (driver_id = auth.uid() OR student_id = auth.uid())
    WITH CHECK (driver_id = auth.uid() OR student_id = auth.uid());

-- 5. CREATE INSERT POLICY FOR STUDENTS
-- Allow authenticated students to create new rides.
DROP POLICY IF EXISTS "Allow students to insert rides" ON rides;
CREATE POLICY "Allow students to insert rides" ON rides
    FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

-- 6. ENABLE AND CREATE POLICIES FOR RIDE PAYMENTS
ALTER TABLE ride_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow students to insert payments" ON ride_payments;
CREATE POLICY "Allow students to insert payments" ON ride_payments
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to select payments" ON ride_payments;
CREATE POLICY "Allow users to select payments" ON ride_payments
    FOR SELECT
    TO authenticated
    USING (true);
