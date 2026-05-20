const { createClient } = require('@supabase/supabase-js');

const url = 'https://oepzwkgdhrzwkgcmaorh.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcHp3a2dkaHJ6d2tnY21hb3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzU3MTcsImV4cCI6MjA5MzgxMTcxN30.9f3JIRcsVhYVumYweKe8vTZAhAiD_1VedMchsj4Z0bE';

const supabase = createClient(url, key);

async function main() {
  const { data: rides, error: ridesErr } = await supabase
    .from('rides')
    .select('*');
    
  if (ridesErr) {
    console.log('Rides Query Error:', ridesErr.message);
    return;
  }
  
  console.log(`Found ${rides.length} rides total.`);
  for (const ride of rides) {
    console.log(`Ride ID: ${ride.id}`);
    console.log(`  Student ID: ${ride.student_id}`);
    console.log(`  Driver ID: ${ride.driver_id}`);
    console.log(`  Status: ${ride.status}`);
    console.log(`  Ride Type: ${ride.ride_type}`);
    console.log(`  Vehicle Type: ${ride.vehicle_type}`);
    console.log(`  Pickup: ${ride.pickup_label}`);
    console.log(`  Destination: ${ride.destination_label}`);
    console.log('------------------------------');
  }
  
  const { data: drivers, error: driversErr } = await supabase
    .from('drivers')
    .select('*');
    
  if (driversErr) {
    console.log('Drivers Query Error:', driversErr.message);
    return;
  }
  
  console.log(`\nFound ${drivers.length} drivers total.`);
  for (const driver of drivers) {
    console.log(`Driver ID: ${driver.user_id}`);
    console.log(`  Email: ${driver.email}`);
    console.log(`  Vehicle Type: ${driver.vehicle_type}`);
    console.log(`  Status: ${driver.status}`);
    console.log(`  Is Approved: ${driver.is_approved}`);
    console.log(`  Is Available: ${driver.is_available}`);
    console.log('------------------------------');
  }
}

main();
