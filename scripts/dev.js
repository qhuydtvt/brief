import { createServer } from 'vite';
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

const port = 5173;

async function start() {
  let ngrokProcess = null;
  let hostname = null;
  let tunnelUrl = null;

  if (authtoken) {
    console.log(`\n🚀 Starting ngrok tunnel for port ${port}...`);
    ngrokProcess = spawn('ngrok', ['http', String(port), '--authtoken', authtoken], {
      stdio: 'ignore',
      shell: true
    });

    // Handle initial launch failures (e.g. command not found)
    ngrokProcess.on('error', (err) => {
      console.warn('⚠️  Failed to start ngrok process:', err.message);
      console.warn('Starting Vite dev server in local-only mode.\n');
      ngrokProcess = null;
    });

    // Poll ngrok local API to retrieve the tunnel URL
    let pollCount = 0;
    const maxPolls = 15;
    
    while (pollCount < maxPolls && !tunnelUrl && ngrokProcess) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        const response = await fetch('http://127.0.0.1:4040/api/tunnels');
        if (response.ok) {
          const data = await response.json();
          if (data.tunnels && data.tunnels.length > 0) {
            tunnelUrl = data.tunnels[0].public_url;
            hostname = new URL(tunnelUrl).hostname;
            break;
          }
        }
      } catch (err) {
        // ngrok API may not be up yet
      }
      pollCount++;
    }

    if (tunnelUrl) {
      console.log(`✅ ngrok tunnel established: ${tunnelUrl}`);
    } else if (ngrokProcess) {
      console.warn('⚠️  ngrok started but tunnel URL could not be retrieved. Running in local-only mode.');
      ngrokProcess.kill('SIGTERM');
      ngrokProcess = null;
    }
  } else {
    console.log('ℹ️  No NGROK_AUTHTOKEN found. Starting dev server in local-only mode.');
  }

  console.log('\n⚡ Starting Vite development server...');

  // Configure Vite with HMR settings targeting the ngrok hostname if tunnel is active
  const viteConfig = {
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: {
      port,
      strictPort: true
    }
  };

  if (hostname) {
    viteConfig.server.allowedHosts = [hostname, '.ngrok-free.app', '.ngrok.app', 'localhost', '127.0.0.1'];
    viteConfig.server.hmr = {
      host: hostname,
      protocol: 'wss',
      clientPort: 443
    };
  }

  const server = await createServer(viteConfig);

  await server.listen();
  server.printUrls();

  if (tunnelUrl) {
    console.log('\n┌────────────────────────────────────────────────────────┐');
    console.log(`│  ngrok tunnel established successfully!                │`);
    console.log(`│  Public URL: \x1b[36m${tunnelUrl}\x1b[0m   │`);
    console.log('└────────────────────────────────────────────────────────┘\n');
  }

  // Handle process termination to clean up both Vite and ngrok processes
  const cleanUp = async () => {
    console.log('\nShutting down dev server and tunnel...');
    try {
      await server.close();
    } catch (e) {}
    if (ngrokProcess) {
      ngrokProcess.kill('SIGTERM');
    }
    process.exit(0);
  };

  process.on('SIGINT', cleanUp);
  process.on('SIGTERM', cleanUp);
}

start().catch((err) => {
  console.error('Error starting dev server:', err);
  process.exit(1);
});
