const url = 'https://oepzwkgdhrzwkgcmaorh.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcHp3a2dkaHJ6d2tnY21hb3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzU3MTcsImV4cCI6MjA5MzgxMTcxN30.9f3JIRcsVhYVumYweKe8vTZAhAiD_1VedMchsj4Z0bE';

async function main() {
  console.log('Fetching Open API description...');
  const res = await fetch(`${url}/rest/v1/`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });
  if (!res.ok) {
    console.log('Failed to fetch REST description:', res.status, res.statusText);
    return;
  }
  const data = await res.json();
  console.log('Paths:', Object.keys(data.paths || {}));
}

main();
