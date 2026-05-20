const { createClient } = require('@supabase/supabase-js');

const url = 'https://oepzwkgdhrzwkgcmaorh.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcHp3a2dkaHJ6d2tnY21hb3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzU3MTcsImV4cCI6MjA5MzgxMTcxN30.9f3JIRcsVhYVumYweKe8vTZAhAiD_1VedMchsj4Z0bE';

const supabase = createClient(url, key);

async function main() {
  const { data, error } = await supabase
    .from('rides')
    .select(
      'pickup_name, pickup, destination_name, destination, dest_label, dest_name, distance, duration'
    )
    .limit(1);
    
  if (error) {
    console.log('Query Error:', error.message, error.code);
  } else {
    console.log('Query Success!', data);
  }
}

main();
