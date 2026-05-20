const { createClient } = require('@supabase/supabase-js');

const url = 'https://oepzwkgdhrzwkgcmaorh.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcHp3a2dkaHJ6d2tnY21hb3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzU3MTcsImV4cCI6MjA5MzgxMTcxN30.9f3JIRcsVhYVumYweKe8vTZAhAiD_1VedMchsj4Z0bE';

const supabase = createClient(url, key);

async function main() {
  const testId = '00000000-0000-0000-0000-000000000000';
  
  // Clean up
  await supabase.from('drivers').delete().eq('user_id', testId);
  
  // Insert
  const { data: insData, error: insErr } = await supabase
    .from('drivers')
    .insert({
      user_id: testId,
      email: 'test@example.com',
      phone: '1234567890',
      vehicle_type: 'bike',
      status: 'pending',
      is_approved: false
    })
    .select();
    
  if (insErr) {
    console.log('Insert Error:', insErr.message);
    return;
  }
  
  console.log('Inserted driver:', insData);
  
  // Try to update from anon client (acting as admin)
  const { data: updData, error: updErr } = await supabase
    .from('drivers')
    .update({ is_approved: true, status: 'approved' })
    .eq('user_id', testId)
    .select();
    
  if (updErr) {
    console.log('Update Error:', updErr.message);
  } else {
    console.log('Update Success:', updData);
  }
  
  // Clean up
  await supabase.from('drivers').delete().eq('user_id', testId);
}

main();
