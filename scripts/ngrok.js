import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file from project root
const envPath = path.resolve(__dirname, '../.env');

let authtoken = process.env.NGROK_AUTHTOKEN || process.env.NGROK_TOKEN;

if (!authtoken && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    if (key === 'NGROK_AUTHTOKEN' || key === 'NGROK_TOKEN') {
      authtoken = val.replace(/^['"]|['"]$/g, '').trim();
      break;
    }
  }
}

if (!authtoken) {
  console.error('Error: NGROK_AUTHTOKEN or NGROK_TOKEN not found in .env file or environment variables.');
  console.error('Please make sure you have a .env file with: NGROK_AUTHTOKEN=your_token');
  process.exit(1);
}

const port = process.env.PORT || '5173';

console.log(`Starting ngrok tunnel for port ${port}...`);

const ngrok = spawn('ngrok', ['http', port, '--authtoken', authtoken], {
  stdio: 'inherit',
  shell: true
});

ngrok.on('error', (err) => {
  console.error('Failed to start ngrok:', err);
});

ngrok.on('close', (code) => {
  if (code !== 0) {
    console.log(`ngrok process exited with code ${code}`);
  }
});
