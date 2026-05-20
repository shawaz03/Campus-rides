const { createClient } = require('@supabase/supabase-js');

const url = 'https://oepzwkgdhrzwkgcmaorh.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcHp3a2dkaHJ6d2tnY21hb3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzU3MTcsImV4cCI6MjA5MzgxMTcxN30.9f3JIRcsVhYVumYweKe8vTZAhAiD_1VedMchsj4Z0bE';

const supabase = createClient(url, key);

async function main() {
  const { data: drivers, error: fetchError } = await supabase
    .from('drivers')
    .select('user_id, status, is_approved')
    .limit(10);
    
  if (fetchError) {
    console.log('Fetch Error:', fetchError.message);
    return;
  }
  
  console.log('Found drivers:', drivers);
  if (drivers.length === 0) {
    console.log('No drivers in database to test.');
    return;
  }
  
  const driver = drivers[0];
  const { data, error } = await supabase
    .from('drivers')
    .update({ is_approved: driver.is_approved, status: driver.status })
    .eq('user_id', driver.user_id)
    .select();
    
  if (error) {
    console.log('Update Error:', error.message, error.code);
  } else {
    console.log('Update Success! Updated data:', data);
  }
}

main();
