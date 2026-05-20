const { createClient } = require('@supabase/supabase-js');

const url = 'https://oepzwkgdhrzwkgcmaorh.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcHp3a2dkaHJ6d2tnY21hb3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzU3MTcsImV4cCI6MjA5MzgxMTcxN30.9f3JIRcsVhYVumYweKe8vTZAhAiD_1VedMchsj4Z0bE';

const supabase = createClient(url, key);

async function main() {
  console.log('Trying to insert driver row anonymously...');
  const { data: driver, error: driverErr } = await supabase
    .from('drivers')
    .insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      email: 'anon@test.com',
      phone: '1234567890',
      vehicle_type: 'bike',
      is_approved: true,
      is_available: true
    })
    .select();
    
  console.log('Driver Insert Result:', driver, driverErr?.message || 'No Error');
  
  console.log('Trying to insert ride row anonymously...');
  const { data: ride, error: rideErr } = await supabase
    .from('rides')
    .insert({
      student_id: '00000000-0000-0000-0000-000000000000',
      status: 'requested',
      ride_type: 'bike',
      vehicle_type: 'bike',
      pickup_label: 'Main Gate',
      destination_label: 'Library',
      distance_km: 2.0,
      duration_min: 5,
      fare: 40
    })
    .select();
    
  console.log('Ride Insert Result:', ride, rideErr?.message || 'No Error');
}

main();
