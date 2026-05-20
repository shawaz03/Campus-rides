const { createClient } = require('@supabase/supabase-js');

const url = 'https://oepzwkgdhrzwkgcmaorh.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcHp3a2dkaHJ6d2tnY21hb3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzU3MTcsImV4cCI6MjA5MzgxMTcxN30.9f3JIRcsVhYVumYweKe8vTZAhAiD_1VedMchsj4Z0bE';

const clientStudent = createClient(url, key, { auth: { persistSession: false } });
const clientDriver = createClient(url, key, { auth: { persistSession: false } });

const randomStr = () => Math.random().toString(36).substring(7);

async function main() {
  const studentEmail = `student_${randomStr()}@campus.edu`;
  const driverEmail = `driver_${randomStr()}@campus.edu`;
  const password = `Pass123!_${randomStr()}`;
  
  console.log('Signing up student...', studentEmail);
  const { data: studentAuth, error: studentSignUpErr } = await clientStudent.auth.signUp({
    email: studentEmail,
    password: password
  });
  
  if (studentSignUpErr) {
    console.log('Student Sign Up Error:', studentSignUpErr.message);
    return;
  }
  
  const studentUser = studentAuth.user;
  console.log('Student user ID:', studentUser?.id);
  
  console.log('Signing up driver...', driverEmail);
  const { data: driverAuth, error: driverSignUpErr } = await clientDriver.auth.signUp({
    email: driverEmail,
    password: password
  });
  
  if (driverSignUpErr) {
    console.log('Driver Sign Up Error:', driverSignUpErr.message);
    return;
  }
  
  const driverUser = driverAuth.user;
  console.log('Driver user ID:', driverUser?.id);
  
  // Insert student profile row
  console.log('Inserting student profile...');
  const { error: profileErr } = await clientStudent.from('students').insert({
    user_id: studentUser.id,
    name: 'Test Student',
    email: studentEmail,
    coins_balance: 100
  });
  
  if (profileErr) {
    console.log('Profile Insert Error:', profileErr.message);
  }
  
  // Create a requested ride as student
  console.log('Creating ride request as student...');
  const { data: ride, error: rideErr } = await clientStudent
    .from('rides')
    .insert({
      student_id: studentUser.id,
      status: 'requested',
      ride_type: 'bike',
      vehicle_type: 'bike',
      pickup_label: 'Main Gate',
      destination_label: 'Library',
      distance_km: 2.0,
      duration_min: 5,
      fare: 40
    })
    .select()
    .single();
    
  if (rideErr) {
    console.log('Create Ride Error:', rideErr.message);
    return;
  }
  
  console.log('Ride created successfully. ID:', ride.id);
  
  // Try to select this ride as the student
  console.log('Reading ride as student...');
  const { data: studentRead, error: studentReadErr } = await clientStudent
    .from('rides')
    .select('id, status')
    .eq('id', ride.id);
    
  console.log('Student Read Result:', studentRead, studentReadErr?.message || 'No Error');
  
  // Try to select this ride as the driver
  console.log('Reading ride as driver...');
  const { data: driverRead, error: driverReadErr } = await clientDriver
    .from('rides')
    .select('id, status')
    .eq('id', ride.id);
    
  console.log('Driver Read Result:', driverRead, driverReadErr?.message || 'No Error');
  
  // Try to select all requested rides where driver_id is null as the driver
  console.log('Reading all requested rides as driver...');
  const { data: allRequested, error: allReqErr } = await clientDriver
    .from('rides')
    .select('id, status')
    .eq('status', 'requested')
    .is('driver_id', null);
    
  console.log('All Requested Rides Read Result:', allRequested, allReqErr?.message || 'No Error');

  // Clean up
  console.log('Cleaning up...');
  await clientStudent.from('rides').delete().eq('id', ride.id);
}

main();
