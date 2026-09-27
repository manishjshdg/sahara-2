// Dual Dev Runner for SAHARA
// Spawns Express backend (Port 5000) and Vite frontend (Port 3000) cross-platform

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting SAHARA Backend (Port 5000) & Frontend (Port 3000)...');

const isWindows = process.platform === 'win32';
const nodeCmd = isWindows ? 'node.exe' : 'node';
const viteBin = path.join(__dirname, 'node_modules/vite/bin/vite.js');

// 1. Start Express Server
const server = spawn(nodeCmd, ['server.js'], {
  stdio: 'inherit',
  shell: isWindows
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

// 2. Start Vite Dev Server directly via Node
const client = spawn(nodeCmd, [viteBin, '--port', '3000', '--host'], {
  stdio: 'inherit',
  shell: isWindows
});

client.on('error', (err) => {
  console.error('Failed to start client:', err);
});

const cleanup = () => {
  console.log('\n🛑 Shutting down SAHARA processes...');
  try {
    server.kill();
  } catch (e) {}
  try {
    client.kill();
  } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
