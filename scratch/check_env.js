console.log('Environment variables:');
for (const key of Object.keys(process.env)) {
  if (key.includes('SUPABASE') || key.includes('SERVICE') || key.includes('KEY') || key.includes('DATABASE') || key.includes('URL')) {
    console.log(`${key}: ${process.env[key] ? 'PRESENT (length ' + process.env[key].length + ')' : 'EMPTY'}`);
  }
}
